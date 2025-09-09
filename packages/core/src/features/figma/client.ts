import { loadConfig } from "../config";

export const getFigmaNodeByIds = async ({
  fileId,
  ids,
}: {
  fileId: string;
  ids: string;
}) => {
  const { config } = await loadConfig();
  const token = config.figma.token;
  const url = new URL(`https://api.figma.com/v1/files/${fileId}/nodes`);
  url.searchParams.set("ids", ids);

  const response = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  return response;
};

export const getFigmaImageByIds = async ({
  fileId,
  ids,
  format = "svg",
  svg_include_id = true,
}: {
  fileId: string;
  ids: string;
  format?: string;
  svg_include_id?: boolean;
}) => {
  const { config } = await loadConfig();
  const token = config.figma.token;
  const url = new URL(`https://api.figma.com/v1/images/${fileId}`);
  url.searchParams.set("ids", ids);
  url.searchParams.set("format", format);
  url.searchParams.set("svg_include_id", svg_include_id.toString());

  const response = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  return response;
};
