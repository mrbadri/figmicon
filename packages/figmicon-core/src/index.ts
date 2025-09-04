import { Command } from "commander";
import { green, cyan } from "kolorist";
import fs from "node:fs/promises";
import path from "node:path";

const program = new Command();

program
  .name("acme")
  .description(
    "Fetch icons from Figma and build React components or sprite.svg"
  )
  .version("0.1.0");

// نمونه‌ی ساده: یک فایل SVG تمرینی می‌سازد تا خروجی را تست کنی
program
  .command("fetch")
  .description("Fetch SVG icons from Figma by node IDs (demo write)")
  .option("-o, --out <dir>", "Output folder for raw SVGs", "tmp/icons")
  .action(async ({ out }) => {
    const outDir = path.resolve(process.cwd(), out);
    await fs.mkdir(outDir, { recursive: true });

    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <path d="M5 12h14" stroke="currentColor" fill="none" stroke-width="2"/>
  <path d="M13 5l7 7-7 7" stroke="currentColor" fill="none" stroke-width="2"/>
</svg>`;
    const filePath = path.join(outDir, "sample.svg");
    await fs.writeFile(filePath, sampleSvg, "utf8");

    console.log(green("✔ fetch is working"));
    console.log(cyan(`→ wrote ${filePath}`));
  });

// نمونه‌ی بسیار ساده‌ی دوم
program
  .command("hello")
  .description("Prints a greeting")
  .option("-n, --name <name>", "Name to greet", "world")
  .action(({ name }) => {
    console.log(`Hello, ${name}!`);
  });

program.parseAsync();
