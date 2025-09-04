import { defineConfig } from "@figmicon/core";

export default defineConfig({
  //   figmaToken: process.env.FIGMA_TOKEN!, // از env
  figmaToken: "dsfsfd",
  fileId: "ABC123DEF", // Figma file ID
  nodeIds: ["12:345", "12:678"], // Node IDهایی که آیکن‌ها داخلش هستند
  outDir: "icons", // خروجی SVG خام
  optimize: {
    svgo: true,
  },
  react: {
    outDir: "packages/react/src/icons",
    baseIconPath: "packages/react/src/BaseIcon.tsx",
    svgrOptions: {
      icon: true,
      typescript: true,
      replaceAttrValues: { "#000": "currentColor" },
    },
  },
  sprite: {
    outDir: "packages/sprite/dist",
    spriteFile: "sprite.svg",
    symbolPrefix: "fig-",
  },
});
