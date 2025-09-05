import { Command } from "commander";

import { fetchCommand } from "./command/fetch/index.js";

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

// hello command
program
  .command("hello")
  .description("Prints a greeting")
  .option("-n, --name <name>", "Name to greet", "world")
  .action(({ name }) => {
    console.log(`Hello, ${name}!`);
  });

program.parseAsync();
