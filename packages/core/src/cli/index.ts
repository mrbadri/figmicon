import { Command } from "commander";
import { fetchCommand } from "@/cli/fetch";
import { cacheStatsCommand, cacheClearCommand } from "@/cli/cache";
import { generatorCommand } from "@/cli/generator";
import { initCommand } from "@/cli/init";

const program = new Command();

program
  .name("iconsync")
  .description(
    "Fetch icons from Figma and build React components or sprite.svg"
  )
  .version("1.0.0");

// fetch command
program
  .command("fetch")
  .description("Fetch SVG icons from Figma by node IDs (demo write)")
  .option("-o, --out <dir>", "Output folder for raw SVGs", "tmp/icons")
  .action(async () => {
    await fetchCommand();
  });

// cache commands
program
  .command("cache:stats")
  .description("Show cache statistics")
  .action(async () => {
    await cacheStatsCommand();
  });

program
  .command("cache:clear")
  .description("Clear all cached files")
  .action(async () => {
    await cacheClearCommand();
  });

// generator command
program
  .command("generator")
  .description("Generate React components from SVG files using SVGR")
  .option("-i, --input <dir>", "Input directory containing SVG files")
  .option("-o, --output <dir>", "Output directory for generated components")
  .option("-c, --config <file>", "Path to SVGR config file")
  .action(async (options) => {
    await generatorCommand({
      inputDir: options.input,
      outputDir: options.output,
      configFile: options.config,
    });
  });

// init command
program
  .command("init")
  .description("Initialize a new icon configuration file")
  .action(async () => {
    await initCommand();
  });

program.parseAsync();
