import { z } from "zod";
import type { Node } from "@figma/rest-api-spec";

export type GenerateFileName = (node: Node, parentNode: Node) => string;
export type NodeType = Node["type"];

const generateFileNameFnSchema = z.custom<GenerateFileName>();
const nodeTypesSchema = z.custom<NodeType>();

export const FigmiconConfigSchema = z.object({
  figma: z.object({
    token: z.string().min(1, "token is required"),
    fileId: z.string().min(1, "fileId is required"),
    nodeId: z.string().min(1, "nodeId is required"),
  }),

  fetch: z
    .object({
      generateFileName: generateFileNameFnSchema.optional(),
      outDir: z.string().default("icons").optional(),
      sanitizeName: z.boolean().default(true).optional(),
      nodeTypes: z.array(nodeTypesSchema).optional(),
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

export type FigmiconConfig = z.infer<typeof FigmiconConfigSchema>;
