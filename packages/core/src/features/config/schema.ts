import { z } from "zod";

import { GenerateFileName } from "./types";
import { NodeType } from "@/features/figma";
import { parseFigmaUrl } from "@/features/figma";

const generateFileNameFnSchema = z.custom<GenerateFileName>();
const nodeTypesSchema = z.custom<NodeType>();

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
      outDir: z.string().default("icons").optional(),
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
});
