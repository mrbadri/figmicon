import { NodeCache } from '@/features/cache';
import { loadConfig } from '@/features/config';
import { downloadNode } from '@/features/fetch';
import { fetchFigmaDocumentNode } from '@/features/fetch/document';
import { figmaLogger } from '@/features/figma';
import { lightYellow } from 'kolorist';
import pLimit from 'p-limit';

export const fetchCommand = async () => {
  const { config, source } = await loadConfig();
  const { figma, fetch } = config;

  // Initialize cache with config file path if caching is enabled
  const nodeCache = source ? new NodeCache(source) : null;

  const limit = pLimit(fetch?.concurrency || 2);
  if (fetch?.concurrency && fetch?.concurrency > 3) {
    console.log(
      figmaLogger(),
      '⚠️ ',
      'Concurrent downloads:',
      fetch?.concurrency,
      'set in config,',
      lightYellow("but it's not recommended to set it to a value greater than 3")
    );
  }

  const documentNode = await fetchFigmaDocumentNode({
    fileId: figma.fileId,
    nodeId: figma.nodeId,
  });

  if (!documentNode) {
    throw new Error('Document node not found');
  }

  // Collect all the download tasks
  const tasks = documentNode.children.map((child) => {
    if (
      fetch?.includeTypes &&
      fetch?.includeTypes?.length > 0 &&
      !fetch?.includeTypes?.includes(child.type)
    )
      return; // Skip if the node type doesn't match the filter

    // Return a limited task based on the node type (ComponentSet or others)
    if (child.type === 'COMPONENT_SET') {
      return child.children.map((ComponentSetChild) =>
        limit(() =>
          downloadNode({
            fileId: figma.fileId,
            node: ComponentSetChild,
            filenameCase: fetch?.filenameCase,
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
          filenameCase: fetch?.filenameCase,
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
