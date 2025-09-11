import z from "zod";
import { IconSyncConfigSchema } from "./schema";
import { Node } from "@figma/rest-api-spec";

export type GenerateFileName = (node: Node, parentNode: Node) => string;

export type ConfigOptions = z.input<typeof IconSyncConfigSchema>;
export type ConfigReturn = z.infer<typeof IconSyncConfigSchema>;
