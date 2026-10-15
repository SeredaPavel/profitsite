#!/bin/bash
set -euo pipefail
umask 077
unset IMAGE_TAG

if [ "$(id -u)" != 0 ]; then
    echo "Run this installer as root on the VPS." >&2
    exit 1
fi
source_dir=$(cd -- "$(dirname -- "$0")" && pwd)
deployment_dir=/opt/hosting/profitsite
public_key_file=${1:-/root/.ssh/profitsite_actions.pub}
test -f "$deployment_dir/compose.yaml"
test -f "$public_key_file"
bash -n "$source_dir/deploy-profitsite.sh"
ssh-keygen -lf "$public_key_file" > /dev/null

exec 9>/run/lock/profitsite-deploy.lock
flock -n 9 || { echo "Another ProfitSite installation/deployment is running." >&2; exit 75; }

# Read the release from the running containers; never guess the rollback version.
backend_id=$(docker compose --project-directory "$deployment_dir" \
    -f "$deployment_dir/compose.yaml" ps -q profitsite-backend)
frontend_id=$(docker compose --project-directory "$deployment_dir" \
    -f "$deployment_dir/compose.yaml" ps -q profitsite-frontend)
test -n "$backend_id"
test -n "$frontend_id"
backend_image=$(docker inspect --format '{{.Config.Image}}' "$backend_id")
frontend_image=$(docker inspect --format '{{.Config.Image}}' "$frontend_id")
current_sha=${backend_image##*:}
[[ "$current_sha" =~ ^[a-f0-9]{40}$ ]]
test "$backend_image" = "ghcr.io/seredapavel/profitsite/backend:$current_sha"
test "$frontend_image" = "ghcr.io/seredapavel/profitsite/frontend:$current_sha"

candidate=$(mktemp "$deployment_dir/.env-setup.XXXXXX")
trap 'rm -f -- "$candidate"' EXIT
python3 - "$deployment_dir/.env" "$candidate" "$current_sha" "$public_key_file" <<'PY'
from pathlib import Path
import re
import sys
source, target, sha, pub = sys.argv[1:]
parts = Path(pub).read_text().split()
if len(parts) < 2 or parts[0] != 'ssh-ed25519':
    raise SystemExit('Expected an Ed25519 public key.')
p = Path(source)
lines = p.read_text().splitlines() if p.exists() else []
lines = [line for line in lines if not re.match(r'^\s*(?:export\s+)?IMAGE_TAG\s*=', line)]
lines.append('IMAGE_TAG=' + sha)
Path(target).write_text('\n'.join(lines) + '\n')
PY

docker compose --project-directory "$deployment_dir" --env-file "$candidate" \
    -f "$source_dir/compose.yaml" config --quiet

backup_dir=$(mktemp -d "$deployment_dir/before-actions-$(date -u +%Y%m%dT%H%M%S)-XXXXXX")
cp -p -- "$deployment_dir/compose.yaml" "$backup_dir/compose.yaml"
if [ -f "$deployment_dir/.env" ]; then
    cp -p -- "$deployment_dir/.env" "$backup_dir/.env"
fi
if [ -f /usr/local/sbin/deploy-profitsite ]; then
    cp -p /usr/local/sbin/deploy-profitsite "$backup_dir/deploy-profitsite"
fi
install -o root -g root -m 0640 "$source_dir/compose.yaml" "$deployment_dir/compose.yaml"
install -o root -g root -m 0600 "$candidate" "$deployment_dir/.env"
install -o root -g root -m 0755 "$source_dir/deploy-profitsite.sh" /usr/local/sbin/deploy-profitsite

python3 - "$public_key_file" <<'PY'
from pathlib import Path
from datetime import datetime, timezone
import os
import sys
parts = Path(sys.argv[1]).read_text().split()
key = ' '.join(parts[:2])
line = 'restrict,command="/usr/local/sbin/deploy-profitsite" ' + key + ' github-actions-profitsite'
directory = Path('/root/.ssh')
directory.mkdir(mode=0o700, exist_ok=True)
os.chmod(directory, 0o700)
path = directory / 'authorized_keys'
text = path.read_text() if path.exists() else ''
if path.exists():
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%f')
    backup = directory / ('authorized_keys.before-profitsite-' + stamp)
    backup.write_bytes(path.read_bytes())
    os.chmod(backup, 0o600)
# Only replace this exact key. Preserve GeoConverter and administrative login keys.
lines = [entry for entry in text.splitlines() if parts[1] not in entry.split()]
lines.append(line)
temporary = directory / 'authorized_keys.profitsite-new'
with temporary.open('w') as handle:
    handle.write('\n'.join(lines) + '\n')
os.chmod(temporary, 0o600)
os.replace(temporary, path)
print('Restricted ProfitSite deployment key installed.')
PY

SSH_ORIGINAL_COMMAND=check /usr/local/sbin/deploy-profitsite
echo "Configuration backup: $backup_dir"
echo "Containers were not restarted. Current release: $current_sha"
