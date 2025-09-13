import { loadConfig } from '@/features/config';
import { generatorLogger } from '@/features/log';
import { existsSync } from 'fs';
import { lightGreen, lightRed, lightYellow } from 'kolorist';
import path from 'path';
import fs from 'fs';
import { DEFAULT_OUT_DIR_FETCH } from '@/features/fetch';
import { generateReactIcon } from '@/features/generator';
import { formatName } from '@/utils/name-format';

export interface GeneratorOptions {
  inputDir?: string;
  outputDir?: string;
  configFile?: string;
}

export const generatorCommand = async (options: GeneratorOptions = {}) => {
  try {
    const { config } = await loadConfig();
    const { generator, fetch } = config;

    //  i want load all file .svg in fetch.outDir is folder

    // generateReactIcon(svgFiles, generator, config);

    if (!generator) {
      console.log(generatorLogger(), lightYellow('⚠️  No SVGR configuration found in config file'));
      console.log(generatorLogger(), "Add 'generator' configuration to your icon.config.ts file");
      return;
    }

    // Determine input and output directories
    const inputDir = options.inputDir || fetch?.outDir || DEFAULT_OUT_DIR_FETCH;
    const outputDir = options.outputDir || generator.outDir || 'src/components/icons';

    console.log(generatorLogger(), `🔧 Generating React components from SVGs...`);
    console.log(generatorLogger(), `📁 Input directory: ${lightGreen(inputDir)}`);
    console.log(generatorLogger(), `📁 Output directory: ${lightGreen(outputDir)}`);

    // Check if input directory exists
    if (!existsSync(inputDir)) {
      console.log(generatorLogger(), lightRed(`❌ Input directory '${inputDir}' does not exist`));
      console.log(generatorLogger(), "Run 'iconsync fetch' first to download SVG icons");
      return;
    }

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(generatorLogger(), `📁 Created output directory: ${outputDir}`);
    }

    // Read SVG files
    const svgFiles = fs.readdirSync(inputDir).filter((file) => file.endsWith('.svg'));

    if (svgFiles.length === 0) {
      console.log(generatorLogger(), lightYellow(`⚠️ No SVG files found in ${inputDir}`));
      return;
    }

    console.log(generatorLogger(), `🎯 Found ${svgFiles.length} SVG file(s) to process`);

    // Process each SVG file
    const generatedFiles: string[] = [];

    for (const file of svgFiles) {
      try {
        const svgPath = path.join(inputDir, file);

        // Generate proper component name using configured case
        const componentName = await generateComponentName(file, generator.filenameCase);

        console.log(generatorLogger(), `⚙️  Processing: ${file} -> ${componentName}.tsx`);

        const result = await generateReactIcon(svgPath, generator, {
          componentName,
          filePath: svgPath,
        });

        const outputPath = path.join(outputDir, `${componentName}.tsx`);
        fs.writeFileSync(outputPath, result, 'utf8');
        generatedFiles.push(`${componentName}.tsx`);
      } catch (error) {
        console.log(
          generatorLogger(),
          lightRed(
            `❌ Failed to process ${file}: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }

    // Generate index file if enabled
    if (generator.index !== false && generatedFiles.length > 0) {
      const indexContent = generateIndexFile(generatedFiles);
      const indexPath = path.join(outputDir, 'index.tsx');
      fs.writeFileSync(indexPath, indexContent, 'utf8');
      console.log(generatorLogger(), `📝 Generated index file: ${indexPath}`);
    }

    console.log(
      generatorLogger(),
      lightGreen(`✅ Successfully generated ${generatedFiles.length} React component(s)!`)
    );
    console.log(generatorLogger(), `📦 Components are available in: ${outputDir}`);
  } catch (error) {
    console.log(
      generatorLogger(),
      lightRed(
        `❌ Generator command failed: ${error instanceof Error ? error.message : String(error)}`
      )
    );
  }
};

async function generateComponentName(
  filename: string,
  caseType: 'camel' | 'kebab' | 'pascal' | 'snake' = 'pascal'
): Promise<string> {
  // Remove .svg extension
  let name = filename.replace(/\.svg$/, '');

  // Convert to the specified case using change-case
  let componentName: string = formatName(name, caseType);

  // For React components, ensure we have a valid component name
  if (caseType === 'pascal' || caseType === 'camel') {
    // Ensure it starts with a letter (prefix with 'Svg' if starts with number)
    if (/^[0-9]/.test(componentName)) {
      componentName = caseType === 'pascal' ? `Svg${componentName}` : `svg${componentName}`;
    }

    // For camelCase, ensure it starts with uppercase for component names
    if (caseType === 'camel') {
      componentName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    }
  }

  return componentName;
}

function generateIndexFile(filenames: string[]): string {
  const exports = filenames
    .map((filename) => {
      const componentName = filename.replace(/\.tsx$/, '');
      return `export { default as ${componentName} } from './${componentName}';`;
    })
    .join('\n');

  return exports + '\n';
}
