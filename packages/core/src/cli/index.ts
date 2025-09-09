import { Command } from "commander";
import { fetchCommand } from "@/cli/fetch";
import { cacheStatsCommand, cacheClearCommand } from "@/cli/cache";

const program = new Command();

program
  .name("figmicon")
  .description(
    "Fetch icons from Figma and build React components or sprite.svg"
  )
  .version("1.0.1");

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

// hello command
program
  .command("hello")
  .description("Prints a greeting")
  .option("-n, --name <name>", "Name to greet", "world")
  .action(({ name }) => {
    console.log(`Hello, ${name}!`);
  });

program.parseAsync();
