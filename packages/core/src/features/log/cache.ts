import { bgGray } from "kolorist";

export const cacheLogger = (message?: string) => {
  return bgGray(" Cache ") + (message ? message : "");
};
