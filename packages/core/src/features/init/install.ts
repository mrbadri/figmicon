import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';
import { configLogger } from '@/features/log';
import { blue, yellow, magenta } from 'kolorist';
import { GUIDE } from '@/constant/guide';

export const detectPackageManager = (cwd: string): 'npm' | 'yarn' | 'pnpm' => {
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  return 'npm';
};

type PackageManager = 'npm' | 'yarn' | 'pnpm';

export const getInstallCommand = (pm: PackageManager, dep: string, dev = false): string => {
  switch (pm) {
    case 'yarn':
      return dev ? `yarn add ${dep} --dev` : `yarn add ${dep}`;
    case 'pnpm':
      return dev ? `pnpm add -D ${dep}` : `pnpm add ${dep}`;
    case 'npm':
    default:
      return dev ? `npm install ${dep} --save-dev` : `npm install ${dep}`;
  }
};

const installationLog = (pm: PackageManager, dep: string) => {
  console.log(
    configLogger(),
    `💡 Please run the following command to install ${yellow(dep)}:`,
    `${magenta(getInstallCommand(pm, dep, true))}`
  );
  console.log(
    configLogger(),
    `For more information, please visit: ${blue(GUIDE.INSTALL_PACKAGE_LINK)}`
  );
};

export const installDependency = (dep: string, cwd: string) => {
  const pm = detectPackageManager(cwd);

  const isWorkspaceEnv = checkForWorkspaceEnvironment(cwd);

  if (isWorkspaceEnv) {
    console.log(
      configLogger(),
      `⚠️  Detected workspace environment. Skipping automatic installation.`
    );

    installationLog(pm, dep);
    return;
  }

  const args =
    pm === 'yarn' ? ['add', dep] : pm === 'pnpm' ? ['add', dep] : ['install', dep, '--save'];

  console.log(`Installing ${dep} with ${pm}...`);
  const result = spawnSync(pm, args, {
    stdio: 'inherit',
    cwd,
  });

  if (result.error) {
    console.error(`Failed to install ${dep}:`, result.error.message);
    installationLog(pm, dep);
    throw new Error(`Installation failed: ${result.error.message}`);
  }

  if (result.status !== 0) {
    installationLog(pm, dep);
    throw new Error(`Installation failed with exit code ${result.status}`);
  }
};

const checkForWorkspaceEnvironment = (cwd: string): boolean => {
  try {
    // Check for pnpm-workspace.yaml, yarn workspace, or lerna
    if (fs.existsSync(path.join(cwd, 'pnpm-workspace.yaml'))) return true;
    if (fs.existsSync(path.join(cwd, 'lerna.json'))) return true;

    // Check for workspace field in package.json
    const packageJsonPath = path.join(cwd, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (packageJson.workspaces) return true;
    }

    // Check parent directories for workspace indicators
    let currentDir = cwd;
    for (let i = 0; i < 3; i++) {
      // Check up to 3 levels up
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) break; // Reached root

      if (fs.existsSync(path.join(parentDir, 'pnpm-workspace.yaml'))) return true;
      if (fs.existsSync(path.join(parentDir, 'lerna.json'))) return true;

      const parentPackageJson = path.join(parentDir, 'package.json');
      if (fs.existsSync(parentPackageJson)) {
        try {
          const content = fs.readFileSync(parentPackageJson, 'utf-8');
          if (content.includes('workspace:')) return true;
          const packageJson = JSON.parse(content);
          if (packageJson.workspaces) return true;
        } catch {
          // Ignore parsing errors
        }
      }

      currentDir = parentDir;
    }

    return false;
  } catch {
    return false;
  }
};
