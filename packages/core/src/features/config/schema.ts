import { z } from 'zod';

import { DEFAULT_OUT_DIR_FETCH } from '@/features/fetch';
import { NodeType, parseFigmaUrl } from '@/features/figma';
import { generatorConfig } from '@/features/generator';
import { GenerateFileName } from './types';

const generateFileNameFnSchema = z.custom<GenerateFileName>();
const nodeTypesSchema = z.custom<NodeType>();
const generatorSchema = z.custom<generatorConfig>();

const figmaSchema = z
  .union([
    z.object({
      token: z
        .string()
        .min(1, 'token is required')
        .describe(
          'Figma API token.\n\nRequired for authentication when calling the Figma REST API.\nUsually stored in `FIGMA_TOKEN` environment variable.'
        ),
      fileId: z
        .string()
        .min(1, 'fileId is required')
        .describe(
          'Figma file ID.\n\nExtracted from the file URL (`https://www.figma.com/file/<fileId>/...`).'
        ),
      nodeId: z
        .string()
        .min(1, 'nodeId is required')
        .describe(
          'Figma node ID.\n\nIdentifies the Frame, Component, or Page within the file (found after `?node-id=` in the URL).'
        ),
    }),
    z.object({
      token: z
        .string()
        .min(1, 'token is required')
        .describe(
          'Figma API token.\n\nRequired for authentication when calling the Figma REST API.\nUsually stored in `FIGMA_TOKEN` environment variable.'
        ),
      url: z
        .string()
        .min(1, 'url is required')
        .describe(
          'Figma file URL.\n\nExample: `https://www.figma.com/file/<fileId>/MyIcons?node-id=30788%3A66894`.\nWill be parsed to extract `fileId` and `nodeId` automatically.'
        ),
    }),
  ])
  .transform((data) => {
    if ('url' in data) {
      return {
        ...data,
        ...parseFigmaUrl(data.url),
      };
    }
    return data;
  });

const fetchSchema = z.object({
  filenameCase: z.enum(['camel', 'pascal', 'kebab', 'snake']).default('kebab').optional(),
  // generateFileName: generateFileNameFnSchema.optional(),
  outDir: z.string().default(DEFAULT_OUT_DIR_FETCH).optional(),
  // sanitizeName: z.boolean().default(true).optional(),
  includeTypes: z.array(nodeTypesSchema).optional(),
  concurrency: z.number().optional(),
});

export const IconSyncConfigSchema = z
  .object({
    figma: figmaSchema,
    fetch: fetchSchema.optional(),
    generator: generatorSchema.optional(),
  })
  .describe('IconSync configuration');
