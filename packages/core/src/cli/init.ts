import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { logoLogger } from '@/features/log/logo';
import { configLogger } from '@/features/log/config';
import { installDependency } from '@/features/init';
import { createConfigFile } from '@/features/config';
import { green, lightGreen } from 'kolorist';

interface InitAnswers {
  installPackage: boolean;
  addScripts: boolean;
  figmaFileId: string;
  figmaNodeId: string;
  figmaAccessToken: string;
  outputDir: string;
  componentType: 'functional' | 'arrow';
  typescript: boolean;
}

export const initCommand = async () => {
  // Check for tsconfig.json
  // const hasTsConfig = fs.existsSync(path.join(process.cwd(), "tsconfig.json"));

  // if (!hasTsConfig) {
  //   console.warn("Warning: No tsconfig.json found in the current directory.");
  //   const { proceed } = await inquirer.prompt([
  //     {
  //       type: "confirm",
  //       name: "proceed",
  //       message: "Would you like to proceed without TypeScript configuration?",
  //       default: true,
  //     },
  //   ]);

  //   if (!proceed) {
  //     console.log("Please create a tsconfig.json file and try again.");
  //     process.exit(1);
  //   }
  // }

  console.log(logoLogger());
  console.log(configLogger(), 'Welcome to the IconSync 🎉 ');
  console.log(configLogger(), "Let's configure your icon sync setup...");

  installDependency('@iconsync/core', process.cwd());

  const configFilePath = await createConfigFile(process.cwd());
  // say config file created successfully and show the path
  console.log(
    configLogger(),
    green('✔'),
    `Config file created successfully! ${lightGreen(configFilePath)}`
  );

  return;

  // Check if package.json exists
  const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));

  // Interactive questions
  const answers = await inquirer.prompt<InitAnswers>([
    {
      type: 'confirm',
      name: 'installPackage',
      message: 'Install @iconsync/core package?',
      default:
        !hasPackageJson ||
        !fs
          .readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
          .includes('@iconsync/core'),
      when: () => hasPackageJson,
    },
    {
      type: 'confirm',
      name: 'addScripts',
      message: 'Add iconsync scripts to package.json?',
      default: true,
      when: () => hasPackageJson,
    },
    {
      type: 'input',
      name: 'figmaFileId',
      message: 'Enter your Figma file ID:',
      validate: (input) => !!input.trim() || 'Figma file ID is required',
    },
    {
      type: 'input',
      name: 'figmaNodeId',
      message: 'Enter your Figma node ID:',
      validate: (input) => !!input.trim() || 'Figma node ID is required',
    },
    {
      type: 'input',
      name: 'figmaAccessToken',
      message: 'Enter your Figma access token:',
      validate: (input) => !!input.trim() || 'Figma access token is required',
    },
    {
      type: 'input',
      name: 'outputDir',
      message: 'Enter output directory for generated components:',
      default: 'src/components/icons',
    },
    {
      type: 'list',
      name: 'componentType',
      message: 'Choose component type:',
      choices: [
        { name: 'Functional Component', value: 'functional' },
        { name: 'Arrow Function', value: 'arrow' },
      ],
      default: 'functional',
    },
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Use TypeScript?',
      default: hasTsConfig,
    },
  ]);

  // Generate config file content
  const configContent = `import { defineConfig } from '@iconsync/core';

export default defineConfig({
  figma: {
    fileId: '${answers.figmaFileId}',
    nodeId: '${answers.figmaNodeId}',
    accessToken: '${answers.figmaAccessToken}',
  },
  output: {
    dir: '${answers.outputDir}',
  },
  generator: {
    componentType: '${answers.componentType}',
    typescript: ${answers.typescript},
  },
});
`;

  // Write config file
  const configPath = path.join(process.cwd(), 'icon.config.ts');
  fs.writeFileSync(configPath, configContent, 'utf-8');

  // Install package if requested
  if (answers.installPackage) {
    console.log('\n📦 Installing @iconsync/core...');
    try {
      installDependency('@iconsync/core', process.cwd());
      console.log('✅ Package installed successfully!');
    } catch (error) {
      console.error('❌ Failed to install package:', error);
      console.log('💡 You can manually install it by running:');
      console.log('   npm install @iconsync/core');
      console.log('   # or');
      console.log('   yarn add @iconsync/core');
      console.log('   # or');
      console.log('   pnpm add @iconsync/core');
    }
  }

  // Add scripts to package.json if requested
  if (answers.addScripts && hasPackageJson) {
    console.log('\n📝 Adding scripts to package.json...');
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      // Add iconsync scripts
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['icon:fetch'] = 'iconsync fetch';
      packageJson.scripts['icon:cache:stats'] = 'iconsync cache:stats';
      packageJson.scripts['icon:cache:clear'] = 'iconsync cache:clear';
      packageJson.scripts['icon:generate'] = 'iconsync generator';

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
      console.log('✅ Scripts added to package.json successfully!');
    } catch (error) {
      console.error('❌ Failed to add scripts:', error);
    }
  }

  console.log('\n✨ IconSync setup completed successfully!');
  console.log(`📝 Config file location: ${configPath}`);

  if (hasPackageJson) {
    console.log('\n🚀 You can now run:');
    console.log('  npm run icon:fetch    # Fetch icons from Figma');
    console.log('  npm run icon:generate # Generate React components');
    console.log('  npm run icon:cache:stats # Check cache statistics');
  }
};
