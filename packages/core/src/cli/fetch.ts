import { NodeCache } from "@/features/cache";
import { loadConfig } from "@/features/config";
import { fetchFigmaDocumentNode } from "@/features/fetch/document";
import { downloadNode } from "@/features/fetch";
import pLimit from "p-limit";

export const fetchCommand = async () => {
  const { config, source } = await loadConfig();
  const { figma, fetch, cache } = config;

  // Initialize cache with config file path if caching is enabled
  const nodeCache =
    source && cache?.enabled !== false
      ? new NodeCache(source, cache?.dir)
      : null;

  // Create a limit function to allow only 3 concurrent downloads at a time
  const limit = pLimit(5);

  const documentNode = await fetchFigmaDocumentNode({
    fileId: figma.fileId,
    nodeId: figma.nodeId,
  });

  if (!documentNode) {
    throw new Error("Document node not found");
  }

  // Collect all the download tasks
  const tasks = documentNode.children.map((child) => {
    if (
      fetch?.nodeTypes &&
      fetch?.nodeTypes?.length > 0 &&
      !fetch?.nodeTypes?.includes(child.type)
    )
      return; // Skip if the node type doesn't match the filter

    // Return a limited task based on the node type (ComponentSet or others)
    if (child.type === "COMPONENT_SET") {
      return child.children.map((ComponentSetChild) =>
        limit(() =>
          downloadNode({
            fileId: figma.fileId,
            node: ComponentSetChild,
            generateFileName: fetch?.generateFileName,
            outDir: fetch?.outDir,
            parentNode: child,
            configPath: source,
            cache: nodeCache,
          })
        )
      );
    } else {
      return limit(() =>
        downloadNode({
          fileId: figma.fileId,
          node: child,
          generateFileName: fetch?.generateFileName,
          outDir: fetch?.outDir,
          parentNode: documentNode,
          configPath: source,
          cache: nodeCache,
        })
      );
    }
  });

  // Flatten tasks array (if it's nested) and execute them
  await Promise.all(tasks.flat());
};
