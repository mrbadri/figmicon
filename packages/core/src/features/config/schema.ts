import { z } from "zod";

import { DEFAULT_OUT_DIR_FETCH } from "@/features/fetch";
import { NodeType, parseFigmaUrl } from "@/features/figma";
import { generatorConfig } from "@/features/generator";
import { GenerateFileName } from "./types";

const generateFileNameFnSchema = z.custom<GenerateFileName>();
const nodeTypesSchema = z.custom<NodeType>();
const generatorSchema = z.custom<generatorConfig>();

export const FigmiconConfigSchema = z.object({
  figma: z
    .union([
      z.object({
        token: z
          .string()
          .min(1, "token is required")
          .describe("Figma API token"),
        fileId: z
          .string()
          .min(1, "fileId is required")
          .describe("Figma file ID"),
        nodeId: z
          .string()
          .min(1, "nodeId is required")
          .describe("Figma node ID"),
      }),
      z.object({
        token: z
          .string()
          .min(1, "token is required")
          .describe("Figma API token"),
        url: z.string().min(1, "url is required").describe("Figma URL"),
      }),
    ])
    .transform((data) => {
      if ("url" in data) {
        return {
          ...data,
          ...parseFigmaUrl(data.url),
        };
      }
      return data;
    }),

  fetch: z
    .object({
      generateFileName: generateFileNameFnSchema.optional(),
      outDir: z.string().default(DEFAULT_OUT_DIR_FETCH).optional(),
      sanitizeName: z.boolean().default(true).optional(),
      nodeTypes: z.array(nodeTypesSchema).optional(),
      concurrentDownloads: z.number().optional(),
    })
    .optional(),

  cache: z
    .object({
      enabled: z.boolean().default(true),
      dir: z.string().default(".figmicon-cache").optional(),
    })
    .optional(),

  sprite: z
    .object({
      enabled: z.boolean().default(false),
      file: z.string().default("sprite.svg"),
    })
    .optional(),

  react: z
    .object({
      enabled: z.boolean().default(false),
      outDir: z.string().default("icons"),
    })
    .optional(),

  generator: generatorSchema.optional(),
  // generator: z
  //   .object({
  //     // Core options
  //     icon: z
  //       .boolean()
  //       .default(true)
  //       .optional()
  //       .describe("Use 1em as width and height"),
  //     typescript: z
  //       .boolean()
  //       .default(true)
  //       .optional()
  //       .describe("Generate TypeScript components"),
  //     dimensions: z
  //       .boolean()
  //       .default(false)
  //       .optional()
  //       .describe("Keep width and height from root SVG tag"),
  //     expandProps: z
  //       .union([z.literal("start"), z.literal("end"), z.boolean()])
  //       .default("end")
  //       .optional()
  //       .describe("Position of props spreading"),

  //     // Naming and output
  //     outDir: z
  //       .string()
  //       .default("src/components/icons")
  //       .optional()
  //       .describe("Output directory for generated components"),
  //     index: z
  //       .boolean()
  //       .default(true)
  //       .optional()
  //       .describe("Generate index file"),
  //     indexTemplate: z
  //       .custom<Function>()
  //       .optional()
  //       .describe("Custom index template function"),

  //     // SVG attributes
  //     titleProp: z
  //       .boolean()
  //       .default(true)
  //       .optional()
  //       .describe("Create a title prop"),
  //     descProp: z
  //       .boolean()
  //       .default(false)
  //       .optional()
  //       .describe("Create a desc prop"),
  //     replaceAttrValues: z
  //       .record(z.string(), z.string())
  //       .optional()
  //       .describe("Replace attribute values"),

  //     // Template and transformation
  //     template: z
  //       .custom<Function>()
  //       .optional()
  //       .describe("Custom template function"),
  //     memo: z
  //       .boolean()
  //       .default(false)
  //       .optional()
  //       .describe("Wrap component with React.memo"),
  //     ref: z
  //       .boolean()
  //       .default(false)
  //       .optional()
  //       .describe("Forward ref to SVG element"),

  //     // SVGO configuration
  //     svgoConfig: z
  //       .object({
  //         plugins: z.array(z.any()).optional(),
  //         multipass: z.boolean().optional(),
  //         datauri: z.string().optional(),
  //       })
  //       .optional()
  //       .describe("SVGO configuration object"),

  //     // File naming
  //     filenameCase: z
  //       .union([
  //         z.literal("camel"),
  //         z.literal("kebab"),
  //         z.literal("pascal"),
  //         z.literal("snake"),
  //       ])
  //       .default("pascal")
  //       .optional()
  //       .describe("Case style for generated file names"),

  //     // JSX runtime
  //     jsxRuntime: z
  //       .union([z.literal("classic"), z.literal("automatic")])
  //       .default("automatic")
  //       .optional()
  //       .describe("JSX runtime"),
  //     jsxRuntimeImport: z
  //       .object({
  //         source: z.string().optional(),
  //         namespace: z.string().optional(),
  //         defaultSpecifier: z.string().optional(),
  //         specifiers: z.array(z.string()).optional(),
  //       })
  //       .optional()
  //       .describe("JSX runtime import configuration"),

  //     // Additional options
  //     namedExport: z.string().optional().describe("Named export identifier"),
  //     exportType: z
  //       .union([z.literal("default"), z.literal("named")])
  //       .default("default")
  //       .optional()
  //       .describe("Export type"),
  //     prettier: z
  //       .boolean()
  //       .default(true)
  //       .optional()
  //       .describe("Use prettier to format generated code"),
  //     prettierConfig: z
  //       .record(z.string(), z.any())
  //       .optional()
  //       .describe("Prettier configuration"),

  //     // CLI-specific options
  //     configFile: z.string().optional().describe("Path to SVGR config file"),
  //     ext: z
  //       .string()
  //       .default("tsx")
  //       .optional()
  //       .describe("File extension for generated components"),
  //     ignoreExisting: z
  //       .boolean()
  //       .default(false)
  //       .optional()
  //       .describe("Ignore existing files"),
  //   })
  //   .optional(),
});
