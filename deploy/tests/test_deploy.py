"""Exercise deployment transitions with fake Docker/HTTP commands; no VPS access."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[1]
OLD = 'a' * 40
NEW = 'b' * 40

DOCKER = r'''#!/usr/bin/env python3
import json, os, pathlib, sys
args = sys.argv[1:]
base = pathlib.Path(os.environ['FIXTURE'])
scenario = os.environ.get('SCENARIO', 'success')
with (base / 'docker-calls').open('a') as f:
    f.write(json.dumps(args) + '\n')
if args[0] == 'info':
    sys.exit(0)
if args[0] == 'inspect':
    service = 'backend' if args[-1] == 'backend-id' else 'frontend'
    print('ghcr.io/seredapavel/profitsite/' + service + ':' + 'a' * 40)
    sys.exit(0)
if args[0] != 'compose':
    sys.exit(99)
if 'ps' in args and '-q' in args:
    print('backend-id' if args[-1] == 'profitsite-backend' else 'frontend-id')
    sys.exit(0)
if 'pull' in args and scenario == 'pull_failure':
    sys.exit(9)
if 'up' in args:
    envpath = pathlib.Path(args[args.index('--env-file') + 1])
    values = dict(line.split('=', 1) for line in envpath.read_text().splitlines() if '=' in line)
    tag = values['IMAGE_TAG']
    with (base / 'ups').open('a') as f:
        f.write(tag + '\n')
    if scenario == 'startup_failure' and tag == 'b' * 40:
        sys.exit(8)
    if scenario == 'rollback_failure':
        sys.exit(8)
sys.exit(0)
'''

CURL = r'''#!/usr/bin/env python3
import os, pathlib, sys
base = pathlib.Path(os.environ['FIXTURE'])
scenario = os.environ.get('SCENARIO', 'success')
text = (base / 'deployment' / '.env').read_text()
new = 'IMAGE_TAG=' + 'b' * 40 in text
if new and scenario == 'http_failure':
    sys.exit(22)
if sys.argv[-1].endswith('/api/lead'):
    print('502' if new and scenario == 'api_failure' else '405', end='')
sys.exit(0)
'''


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.deployment = self.base / 'deployment'
        self.deployment.mkdir()
        self.original = 'EXISTING_SETTING=preserved\nIMAGE_TAG=' + OLD + '\n'
        (self.deployment / '.env').write_text(self.original)
        (self.deployment / 'compose.yaml').write_text('name: profitsite\n')
        self.bin = self.base / 'bin'
        self.bin.mkdir()
        for name, text in [('docker', DOCKER), ('curl', CURL)]:
            path = self.bin / name
            path.write_text(text)
            path.chmod(0o755)
        self.script = self.base / 'deploy-profitsite.sh'
        text = (SOURCE / 'deploy-profitsite.sh').read_text()
        text = text.replace('/opt/hosting/profitsite', str(self.deployment))
        text = text.replace('/run/lock/profitsite-deploy.lock', str(self.base / 'lock'))
        self.script.write_text(text)
        self.env = dict(os.environ, PATH=str(self.bin) + ':' + os.environ['PATH'],
                        FIXTURE=str(self.base), SSH_ORIGINAL_COMMAND='deploy ' + NEW)

    def run_script(self, scenario='success', command=None):
        env = dict(self.env, SCENARIO=scenario)
        if command is not None:
            env['SSH_ORIGINAL_COMMAND'] = command
        return subprocess.run(['bash', str(self.script)], env=env, text=True,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)

    def ups(self):
        path = self.base / 'ups'
        return path.read_text().splitlines() if path.exists() else []

    def assert_clean(self):
        self.assertEqual(list(self.deployment.glob('.env-next.*')), [])

    def test_check(self):
        result = self.run_script(command='check')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('READY: ProfitSite', result.stdout)
        self.assertEqual(self.ups(), [])

    def test_denied_commands(self):
        for command in ['', 'bash', 'deploy latest', 'deploy ' + NEW + '; id', 'check extra']:
            with self.subTest(command=command):
                self.assertEqual(self.run_script(command=command).returncode, 64)
        self.assertFalse((self.base / 'docker-calls').exists())

    def test_success_and_preserved_settings(self):
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.ups(), [NEW])
        self.assertIn('IMAGE_TAG=' + NEW, (self.deployment / '.env').read_text())
        self.assertIn('EXISTING_SETTING=preserved', (self.deployment / '.env').read_text())
        self.assertEqual((self.deployment / 'previous.env').read_text(), self.original)
        self.assertEqual(len(list((self.deployment / 'releases').glob('*.env'))), 1)
        self.assert_clean()

    def test_pull_failure_does_not_change_active_release(self):
        result = self.run_script('pull_failure')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.ups(), [])
        self.assertEqual((self.deployment / '.env').read_text(), self.original)
        self.assert_clean()

    def test_failed_release_is_rolled_back(self):
        for scenario in ['startup_failure', 'http_failure', 'api_failure']:
            with self.subTest(scenario=scenario):
                (self.base / 'ups').unlink(missing_ok=True)
                result = self.run_script(scenario)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(self.ups(), [NEW, OLD])
                self.assertEqual((self.deployment / '.env').read_text(), self.original)
                self.assertIn('Previous containers and HTTP routes restored.', result.stderr)
                self.assert_clean()

    def test_rollback_failure_reported(self):
        result = self.run_script('rollback_failure')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('ROLLBACK FAILED', result.stderr)
        self.assertEqual(self.ups(), [NEW, OLD])
        self.assertEqual((self.deployment / '.env').read_text(), self.original)
        self.assert_clean()

    def test_concurrent_deploy_is_rejected(self):
        import fcntl
        with (self.base / 'lock').open('w') as handle:
            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            result = self.run_script()
        self.assertEqual(result.returncode, 75)
        self.assertEqual(self.ups(), [])

    def test_installer_preserves_keys_and_does_not_restart_containers(self):
        source = self.base / 'installer'
        source.mkdir()
        (source / 'deploy-profitsite.sh').write_text(self.script.read_text())
        (source / 'compose.yaml').write_text((SOURCE / 'compose.yaml').read_text())
        ssh_dir = self.base / 'ssh'
        ssh_dir.mkdir()
        (ssh_dir / 'authorized_keys').write_text('existing-admin-key\nexisting-geoconverter-key\n')
        key = ssh_dir / 'profitsite_actions'
        subprocess.run(['ssh-keygen', '-q', '-t', 'ed25519', '-N', '', '-f', str(key)], check=True)
        installed_script = self.base / 'installed-deploy'
        script = (SOURCE / 'install-actions-key.sh').read_text()
        script = script.replace('/opt/hosting/profitsite', str(self.deployment))
        script = script.replace('/run/lock/profitsite-deploy.lock', str(self.base / 'lock'))
        script = script.replace('/root/.ssh', str(ssh_dir))
        script = script.replace('/usr/local/sbin/deploy-profitsite', str(installed_script))
        installer = source / 'install-actions-key.sh'
        installer.write_text(script)
        for _ in range(2):
            result = subprocess.run(['bash', str(installer), str(key) + '.pub'],
                                    env=self.env, text=True, stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE, timeout=20)
            self.assertEqual(result.returncode, 0, result.stderr)
        keys = (ssh_dir / 'authorized_keys').read_text()
        self.assertIn('existing-admin-key\n', keys)
        self.assertIn('existing-geoconverter-key\n', keys)
        self.assertEqual(keys.count('github-actions-profitsite'), 1)
        self.assertIn('restrict,command="' + str(installed_script) + '"', keys)
        self.assertEqual((ssh_dir / 'authorized_keys').stat().st_mode & 0o777, 0o600)
        self.assertEqual(self.ups(), [])
        self.assertEqual((self.deployment / '.env').read_text(), self.original)
        self.assertEqual(len(list(self.deployment.glob('before-actions-*'))), 2)


if __name__ == '__main__':
    unittest.main(verbosity=2)
