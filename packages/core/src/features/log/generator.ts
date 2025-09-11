import { bgBlue } from "kolorist";

export const generatorLogger = (message?: string) => {
  return bgBlue(" Generator ") + (message ? message : "");
};
