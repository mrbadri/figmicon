import { Config } from "@svgr/core";

export type generatorConfig = Config & {
  // Custom properties for our generator
  outDir?: string;
  index?: boolean;
  ext?: string;
  ignoreExisting?: boolean;
  filenameCase?: "camel" | "kebab" | "pascal" | "snake";
};
