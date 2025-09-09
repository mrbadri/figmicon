import { NodeCache } from "@/features/cache";
import { loadConfig } from "@/features/config";
import { fetchFigmaDocumentNode } from "@/features/fetch/document";
import { downloadNode } from "@/features/fetch";

export const fetchCommand = async () => {
  const { config, source } = await loadConfig();
  const { figma, fetch, cache } = config;

  // Initialize cache with config file path if caching is enabled
  const nodeCache =
    source && cache?.enabled !== false
      ? new NodeCache(source, cache?.dir)
      : null;

  const documentNode = await fetchFigmaDocumentNode({
    fileId: figma.fileId,
    nodeId: figma.nodeId,
  });

  if (!documentNode) {
    throw new Error("Document node not found");
  }

  documentNode.children.slice(0, 4).forEach(async (child) => {
    if (
      fetch?.nodeTypes &&
      fetch?.nodeTypes?.length > 0 &&
      !fetch?.nodeTypes?.includes(child.type)
    )
      return;

    if (child.type === "COMPONENT_SET") {
      child.children.forEach(async (ComponentSetChild) => {
        await downloadNode({
          fileId: figma.fileId,
          node: ComponentSetChild,
          generateFileName: fetch?.generateFileName,
          outDir: fetch?.outDir,
          parentNode: child,
          configPath: source,
          cache: nodeCache,
        });
      });
    } else {
      await downloadNode({
        fileId: figma.fileId,
        node: child,
        generateFileName: fetch?.generateFileName,
        outDir: fetch?.outDir,
        parentNode: documentNode,
        configPath: source,
        cache: nodeCache,
      });
    }
  });
};
