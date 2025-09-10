/// <reference types="node" />
import { iconConfig } from "@figmicon/core";

// https://www.figma.com/design/iH0P8rAVJjqln9jiuNqY7R/VergeCloud?node-id=10806-24901&m=dev

// TODO: check this URL
// https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30789-32015&m=dev
// https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30788-66894&t=AXIVkr6jFRczopB2-4

export default iconConfig({
  figma: {
    token: process.env.FIGMA_TOKEN!,
    url: "https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30788-66894&t=AXIVkr6jFRczopB2-4",
    // fileId: "iH0P8rAVJjqln9jiuNqY7R",
    // nodeId: "10806-24901",
    // INFO: you can use parseFigmaUrl to parse the url alternative to fileId and nodeId
    // ...parseFigmaUrl(
    //   "https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30788-66894&t=AXIVkr6jFRczopB2-4"
    // ),
  },
  fetch: {
    concurrentDownloads: 5,
  },
  // fetch: {
  //   // nodeTypes: ["COMPONENT", "COMPONENT_SET"],
  //   generateFileName: (node, parentNode) => node.name + "--" + parentNode.name,
  //   // outDir: "icons/badri",
  //   sanitizeName: true,
  //  limit: 5,
  // logger:  () => console.log("🔥"),
  // },

  //  create html to view all icons
});
