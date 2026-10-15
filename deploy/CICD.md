# ProfitSite: GHCR and VPS deployment

## Current layout

- Project: `/opt/hosting/profitsite`.
- Compose services: `profitsite-backend`, `profitsite-frontend`.
- Network: external `hosting_profitsite_edge`, already connected to the common Caddy.
- Images: `ghcr.io/seredapavel/profitsite/backend:<40-character SHA>` and
  `ghcr.io/seredapavel/profitsite/frontend:<40-character SHA>`.
- The local `.env` selects the common `IMAGE_TAG`. It is not committed.
- Caddy routes `/api` and `/api/*` to backend with the prefix preserved;
  other paths go to frontend. Backend health endpoint is `/health` internally.
- SMTP and real form submission are not configured by this change.

## What the workflow does

Pushes to `infra/ghcr-hosting` and `main` build and check both images, then publish
SHA tags. Only `main` also updates `latest`. Deployments always use SHA tags.
The deployment script tests run in a disposable runner with fake Docker/HTTP;
these checks do not test actual VPS recovery.

Automatic deployment runs only on pushes to `main`, after both images and the
script checks pass. Manual dispatch deploys only when run on `main` with the
`deploy` checkbox selected. Other branches do not deploy.

Before merging to `main`, complete installation, a real SSH `check`, and all
three Secrets below. Do not merge until those steps are complete.

## Initial VPS installation

Upload only `compose.yaml`, `deploy-profitsite.sh`, and `install-actions-key.sh`
from this folder to a staging folder such as `/root/profitsite-deploy-setup`.
Do not copy the new Compose file over the active configuration manually.
The installer first reads the current SHA from both running containers and
validates that they belong to this project and match. It validates the new
Compose configuration before installing it. It saves the old Compose and `.env`
in a private `before-actions-*` directory. The installer does not restart
containers or change Caddy.

Create a separate Ed25519 key on the VPS at `/root/.ssh/profitsite_actions`.
Never overwrite an existing key without investigating it. Keep the private key
out of chat and the repository. The installer accepts an optional public key
path; by default it reads `/root/.ssh/profitsite_actions.pub`.

Normalize CRLF if files were transferred from Windows, then run as root:

```bash
cd /root/profitsite-deploy-setup
sed -i 's/\r$//' deploy-profitsite.sh install-actions-key.sh compose.yaml
bash install-actions-key.sh
```

The installed forced command is `/usr/local/sbin/deploy-profitsite`.
The `authorized_keys` entry uses `restrict` and allows only `check` or
`deploy <40-character lowercase commit SHA>`. Other login keys are preserved;
the installer backs up `authorized_keys` before changing it. It can be rerun
with the same key without duplicating that entry.

Test the actual SSH key with `check`, using independently verified host keys
and `StrictHostKeyChecking=yes`. A direct local invocation of the deployment
script does not verify the SSH restriction. Expected response:
`READY: ProfitSite deployment access works.`

## GitHub Actions Secrets

Configure in the ProfitSite repository only:

- `PROFITSITE_VPS_HOST`: `13.143.244.89` (SSH port 22).
- `PROFITSITE_VPS_SSH_KEY`: the new private deployment key.
- `PROFITSITE_VPS_KNOWN_HOSTS`: verified OpenSSH known-host lines for that IP.

Reuse verified host identity data from this server, rather than trusting an
unverified `ssh-keyscan` response. Credentials for reading GHCR remain in root's
existing Docker login on the VPS; no GHCR PAT is sent from Actions.

## Deployment and rollback

The forced command takes a ProfitSite-only lock, creates a candidate `.env`,
and pulls both new images before changing the active version. A pull failure
leaves the current `.env` and running containers intact. When images are ready,
it archives the previous `.env`, switches versions, and waits for both Compose
healthchecks. Then it checks HTTPS through local Caddy with certificate
validation: `/` must succeed and GET `/api/lead` must return 405. It does not
POST a lead or send mail.

On startup or HTTP failure it restores the archived `.env`, starts the previous
images without pulling, and checks the routes again. Failed rollback is reported
explicitly. Do not prune images while a deployment or recovery is running.
An abrupt power loss or SIGKILL cannot be handled by shell traps.

A successful update records the old settings in `previous.env`; every switch
also creates a timestamped copy in `releases/`. Files are private because the
`.env` may later include secrets.

Manual recovery as root (only after checking the backup version):

```bash
cd /opt/hosting/profitsite
cp -p .env ".env.before-manual-rollback-$(date -u +%Y%m%dT%H%M%S)"
cp -p previous.env .env
docker compose up -d --no-build --pull never --wait --wait-timeout 180
```

The scripts manage images and containers; future code/configuration or database
migrations require a separate recovery plan. Production Compose and scripts
are installed deliberately; ordinary image deployment does not overwrite them.

## Local checks

```bash
bash -n deploy/deploy-profitsite.sh deploy/install-actions-key.sh
sudo python3 deploy/tests/test_deploy.py
```

The suite tests success, denied commands, pull errors, startup and HTTP errors,
rollback errors, concurrent calls, and repeat installer execution with key
preservation. The installer test needs root because the installer sets file
ownership; all test paths and commands are isolated in temporary directories.
No real containers, Caddy configuration, or SSH keys are modified by the tests.
