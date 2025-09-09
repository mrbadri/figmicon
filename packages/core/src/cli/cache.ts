import { loadConfig } from "../features/config";
import { NodeCache } from "@/features/cache";
import { green, cyan, yellow } from "kolorist";
import { cacheLogger } from "@/features/cache";

export const cacheStatsCommand = async () => {
  const { source } = await loadConfig();

  if (!source) {
    console.error(cacheLogger(), "❌", "Could not find config file path");
    return;
  }

  const nodeCache = new NodeCache(source);
  const stats = await nodeCache.getCacheStats();

  console.log(cacheLogger(), "📊", "Cache Statistics:");
  console.log(`  Total entries: ${cyan(stats.totalEntries.toString())}`);
  console.log(`  Cache size: ${cyan(stats.cacheSize)}`);

  if (stats.oldestEntry) {
    console.log(
      `  Oldest entry: ${yellow(new Date(stats.oldestEntry).toLocaleString())}`
    );
  }

  if (stats.newestEntry) {
    console.log(
      `  Newest entry: ${yellow(new Date(stats.newestEntry).toLocaleString())}`
    );
  }

  if (stats.totalEntries === 0) {
    console.log(yellow("  No cache entries found"));
  }
};

export const cacheClearCommand = async () => {
  const { source } = await loadConfig();

  if (!source) {
    console.error(cacheLogger(), "❌", "Could not find config file path");
    return;
  }

  const nodeCache = new NodeCache(source);
  await nodeCache.clearCache();
  console.log(cacheLogger(), green("✔"), "Cache cleared successfully");
};
