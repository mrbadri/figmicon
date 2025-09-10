import { gray } from "kolorist";

export const pad = (text: string, length: number, fillString: string = " ") => {
  return text.padEnd(length, fillString).replace(text, "");
};

export const arrowPad = (
  text: string,
  length: number = 40,
  fillString: string = "-"
) => {
  return gray(pad(text, length, fillString)) + gray("→");
};

export const firstPad = (
  text: string,
  length: number = 12,
  fillString: string = " "
) => {
  return text.padEnd(length, fillString);
};
