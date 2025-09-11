import { State, transform } from "@svgr/core";
import fs from "fs";
import { generatorConfig } from "./types";

export const generateReactIcon = async (
  svgPath: string,
  config: generatorConfig,
  state: Partial<State>
) => {
  const svgCode = fs.readFileSync(svgPath, "utf8");

  // Default SVGR configuration with user overrides
  const svgrConfig: generatorConfig = {
    // Required plugins for proper JSX transformation
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],

    // Default SVGR options
    icon: true,
    typescript: true,
    dimensions: false,
    expandProps: "end",
    titleProp: true,
    replaceAttrValues: {
      "#3E7BFA": "currentColor",
      white: "currentColor",
      "#000": "currentColor",
      "#000000": "currentColor",
      "#fff": "currentColor",
      "#ffffff": "currentColor",
    },

    // User configuration overrides
    ...config,

    // Custom template that matches the existing .svgrrc.js style
    template: (variables, { tpl }) => {
      return tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => (
  ${variables.jsx}
);
 
${variables.componentName}.displayName = "${variables.componentName}";

${variables.exports}; 
`;
    },
  };

  const jsCode = await transform(svgCode, svgrConfig, state);

  return jsCode;
};
