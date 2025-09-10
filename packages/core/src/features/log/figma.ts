import { bgWhite } from "kolorist";

export const figmaLogger = (message?: string) => {
  return bgWhite(" Figma ") + (message ? message : "");
};
