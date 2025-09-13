import { bgCyan } from "kolorist";

export const configLogger = (message?: string) => {
  return bgCyan(" Config ") + (message ? message : "");
};
