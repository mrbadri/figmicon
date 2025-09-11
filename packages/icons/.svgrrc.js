module.exports = {
  icon: true,
  titleProp: true,
  replaceAttrValues: {
    "#3E7BFA": "currentColor",
    white: "currentColor",
    "#000": "currentColor",
    "#000000": "currentColor",
    "#fff": "currentColor",
    "#ffffff": "currentColor",
  },
  typescript: true,
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

