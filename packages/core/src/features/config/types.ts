import z from "zod";
import { FigmiconConfigSchema } from "./schema";
import { Node } from "@figma/rest-api-spec";

export type GenerateFileName = (node: Node, parentNode: Node) => string;


export type ConfigOptions = z.input<typeof FigmiconConfigSchema>;
export type ConfigReturn = z.infer<typeof FigmiconConfigSchema>;