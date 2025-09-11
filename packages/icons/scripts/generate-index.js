#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "../src/components");
const indexPath = path.join(__dirname, "../src/index.ts");

function pascalCase(str) {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

function generateIndex() {
  if (!fs.existsSync(componentsDir)) {
    console.log(
      "Components directory does not exist. Run generate:icons first."
    );
    return;
  }

  const files = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(".tsx", ""));

  const exports = files
    .map((file) => {
      const componentName = pascalCase(file);
      return `export { default as ${componentName} } from './components/${file}';`;
    })
    .join("\n");

  const indexContent = `// Auto-generated file. Do not edit manually.
${exports}

// Export all components as a namespace
export * as Icons from './components';
`;

  fs.writeFileSync(indexPath, indexContent);
  console.log(`Generated index.ts with ${files.length} icon components`);
}

generateIndex();

