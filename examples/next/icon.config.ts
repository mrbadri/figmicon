/// <reference types="node" />
import { iconConfig } from '@iconsync/core';

export default iconConfig({
  figma: {
    token: process.env.FIGMA_TOKEN!,
    url: 'https://www.figma.com/design/B6R9BOyrbu0h3dVMhh1kkT/coolicons-%7C-Free-Iconset--Community-?node-id=30788-66894&t=AXIVkr6jFRczopB2-4',
    // alternatively you can use fileId and nodeId
    // fileId: "iH0P8rAVJjqln9jiuNqY7R",
    // nodeId: "10806-24901",
  },
  fetch: {
    includeTypes: ['COMPONENT', 'COMPONENT_SET'],
    concurrency: 3,
    filenameCase: 'kebab',
    outDir: 'assets/icons',
  },

  generator: {
    icon: true,
    typescript: true,
    titleProp: true,
    dimensions: false,
    expandProps: 'end',
    replaceAttrValues: {
      '#3E7BFA': 'currentColor',
      white: 'currentColor',
      '#000': 'currentColor',
      '#000000': 'currentColor',
      '#fff': 'currentColor',
      '#ffffff': 'currentColor',
    },
    outDir: 'src/components/icons',
    ext: 'tsx',
    prettier: true,
    memo: false,
    ref: false,
    filenameCase: 'kebab',
  },
});
