#!/bin/bash
set -Eeuo pipefail
umask 077
unset IMAGE_TAG

deployment_dir=/opt/hosting/profitsite
request=${SSH_ORIGINAL_COMMAND:-}
candidate=
previous=
switched=false

compose() {
    docker compose --project-directory "$deployment_dir" \
        --env-file "$deployment_dir/.env" \
        -f "$deployment_dir/compose.yaml" "$@"
}

if [ "$request" = check ]; then
    test -f "$deployment_dir/compose.yaml"
    test -f "$deployment_dir/.env"
    docker info > /dev/null
    compose config --quiet
    echo "READY: ProfitSite deployment access works."
    exit 0
fi

if [[ ! "$request" =~ ^deploy\ ([a-f0-9]{40})$ ]]; then
    echo "Denied: expected 'check' or 'deploy <40-character commit SHA>'." >&2
    exit 64
fi
release_sha=${BASH_REMATCH[1]}

exec 9>/run/lock/profitsite-deploy.lock
if ! flock -n 9; then
    echo "Another ProfitSite deployment is running." >&2
    exit 75
fi

verify_routes() {
    local code
    curl --fail --silent --show-error --connect-timeout 5 --max-time 15 \
        --resolve profitsite.ru:443:127.0.0.1 \
        https://profitsite.ru/ > /dev/null || return 1
    code=$(curl --silent --show-error --connect-timeout 5 --max-time 15 \
        --output /dev/null --write-out '%{http_code}' \
        --resolve profitsite.ru:443:127.0.0.1 \
        https://profitsite.ru/api/lead) || return 1
    if [ "$code" != 405 ]; then
        echo "Expected GET /api/lead to return 405, received $code." >&2
        return 1
    fi
}

cleanup() {
    if [ -n "$candidate" ]; then
        rm -f -- "$candidate"
    fi
}

fail() {
    local status="$1"
    trap - ERR INT TERM HUP
    echo "Deployment failed (exit $status)." >&2
    if [ "$switched" = true ]; then
        compose logs --tail=60 profitsite-backend profitsite-frontend || true
        echo "Restoring previous ProfitSite images..." >&2
        if cp -p -- "$previous" "$deployment_dir/.env" &&
           compose up -d --no-build --pull never --wait --wait-timeout 180 &&
           verify_routes; then
            echo "Previous containers and HTTP routes restored." >&2
        else
            echo "ROLLBACK FAILED. Inspect ProfitSite containers manually." >&2
        fi
    else
        echo "Running containers and active image settings were not changed." >&2
    fi
    exit "$status"
}

trap cleanup EXIT
trap 'fail $?' ERR
trap 'fail 130' INT
trap 'fail 143' TERM
trap 'fail 129' HUP

test -f "$deployment_dir/compose.yaml"
test -f "$deployment_dir/.env"
install -m 0700 -d "$deployment_dir/releases"
candidate=$(mktemp "$deployment_dir/.env-next.XXXXXX")
cp -- "$deployment_dir/.env" "$candidate"

python3 - "$candidate" "$release_sha" <<'PY'
from pathlib import Path
import re
import sys
p = Path(sys.argv[1])
lines = [line for line in p.read_text().splitlines()
         if not re.match(r'^\s*(?:export\s+)?IMAGE_TAG\s*=', line)]
lines.append('IMAGE_TAG=' + sys.argv[2])
p.write_text('\n'.join(lines) + '\n')
PY

docker compose --project-directory "$deployment_dir" --env-file "$candidate" \
    -f "$deployment_dir/compose.yaml" config --quiet

echo "Downloading ProfitSite images for $release_sha..."
docker compose --project-directory "$deployment_dir" --env-file "$candidate" \
    -f "$deployment_dir/compose.yaml" pull --policy missing

previous="$deployment_dir/releases/$(date -u +%Y%m%dT%H%M%S)-before-$release_sha.env"
cp -p -- "$deployment_dir/.env" "$previous"
switched=true
mv -- "$candidate" "$deployment_dir/.env"
candidate=

compose up -d --no-build --pull never --wait --wait-timeout 180
verify_routes

cp -p -- "$previous" "$deployment_dir/previous.env"
compose ps
echo "SUCCESS: ProfitSite deployed from $release_sha."
echo "Rollback settings saved in $deployment_dir/previous.env"
