import { defineConfig, parseFigmaUrl } from "@figmicon/core";

// https://www.figma.com/design/iH0P8rAVJjqln9jiuNqY7R/VergeCloud?node-id=10806-24901&m=dev

// TODO: check this URL
// https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30789-32015&m=dev

export default defineConfig({
  figma: {
    token: process.env.FIGMA_TOKEN!,
    // fileId: "iH0P8rAVJjqln9jiuNqY7R",
    // nodeId: "10806-24901",
    // INFO: you can use parseFigmaUrl to parse the url alternative to fileId and nodeId
    ...parseFigmaUrl(
      "https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30789-32168&m=dev"
    ),
  },
  fetch: {
    // nodeTypes: ["COMPONENT", "COMPONENT_SET"],
    generateFileName: (node, parentNode) => node.name + "--" + parentNode.name,
    outDir: "icons/badri",
    sanitizeName: true,
  },
});
