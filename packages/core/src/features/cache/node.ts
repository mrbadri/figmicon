import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { type Node } from "@figma/rest-api-spec";
import { green, cyan, yellow } from "kolorist";
import { cacheLogger } from "@/features/cache";

export interface CacheEntry {
  nodeHash: string;
  filePath: string;
  downloadedAt: string;
  nodeId: string;
  nodeName: string;
  fileId: string;
}

export interface CacheIndex {
  [nodeId: string]: CacheEntry;
}

export class NodeCache {
  private cacheDir: string;
  private cacheIndexPath: string;
  private index: CacheIndex = {};

  constructor(configPath: string, cacheDirName: string = ".iconsync/cache") {
    const configDir = path.dirname(configPath);
    this.cacheDir = path.join(configDir, cacheDirName);
    this.cacheIndexPath = path.join(this.cacheDir, "index.json");
  }

  /**
   * Generate a hash for a node based on properties that indicate changes
   */
  private generateNodeHash(
    node: Node,
    parentNode: Node,
    fileId: string
  ): string {
    const hashData = {
      nodeId: node.id,
      nodeName: node.name,
      nodeType: node.type,
      lastModified: (node as any).lastModified || null,
      boundingBox: (node as any).absoluteBoundingBox || null,
      fills: (node as any).fills || null,
      effects: (node as any).effects || null,
      parentId: parentNode.id,
      parentName: parentNode.name,
      fileId,
    };

    const hashString = JSON.stringify(hashData, null, 0);
    return crypto
      .createHash("sha256")
      .update(hashString)
      .digest("hex")
      .substring(0, 16);
  }

  /**
   * Load cache index from disk
   */
  private async loadCacheIndex(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });

      const indexData = await fs.readFile(this.cacheIndexPath, "utf8");
      this.index = JSON.parse(indexData);

      console.log(
        cacheLogger(),
        green("✔"),
        `Loaded cache index with ${cyan(Object.keys(this.index).length.toString())} entries`
      );
    } catch (error) {
      // Cache index doesn't exist or is invalid, start fresh
      this.index = {};
      console.log(
        cacheLogger(),
        yellow("ℹ"),
        "No existing cache found, starting fresh"
      );
    }
  }

  /**
   * Generate a key for a cache index entry
   */
  private generateCacheIndexKey(nodeId: string, fileId: string): string {
    return `${nodeId}-${fileId}`;
  }

  /**
   * Save cache index to disk
   */
  private async saveCacheIndex(): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.writeFile(
      this.cacheIndexPath,
      JSON.stringify(this.index, null, 2),
      "utf8"
    );
  }

  /**
   * Check if a node is cached and up-to-date
   */
  async isCached(
    node: Node,
    parentNode: Node,
    fileId: string
  ): Promise<boolean> {
    await this.loadCacheIndex();

    const nodeHash = this.generateNodeHash(node, parentNode, fileId);
    const cacheEntry = this.index[this.generateCacheIndexKey(node.id, fileId)];

    if (!cacheEntry) {
      console.log(
        cacheLogger(),
        yellow("⚠"),
        `Node ${cyan(node.name || node.id)} not found in cache`
      );
      return false;
    }

    if (cacheEntry.nodeHash !== nodeHash) {
      console.log(
        cacheLogger(),
        yellow("⚠"),
        `Node ${cyan(node.name || node.id)} hash changed, cache invalid`
      );
      return false;
    }

    // Check if the actual file still exists
    try {
      await fs.access(cacheEntry.filePath);
      console.log(
        cacheLogger(),
        green("✔"),
        `Node ${cyan(node.name || node.id)} found in cache and up-to-date`
      );
      return true;
    } catch {
      console.log(
        cacheLogger(),
        yellow("⚠"),
        `Node ${cyan(node.name || node.id)} cached but file missing, will re-download`
      );
      // Remove invalid cache entry
      delete this.index[this.generateCacheIndexKey(node.id, fileId)];
      await this.saveCacheIndex();
      return false;
    }
  }

  /**
   * Get cached file path for a node
   */
  getCachedFilePath(nodeId: string, fileId: string): string | null {
    const cacheEntry = this.index[this.generateCacheIndexKey(nodeId, fileId)];
    return cacheEntry ? cacheEntry.filePath : null;
  }

  /**
   * Add or update a cache entry
   */
  async setCacheEntry(
    node: Node,
    parentNode: Node,
    fileId: string,
    filePath: string
  ): Promise<void> {
    await this.loadCacheIndex();

    const nodeHash = this.generateNodeHash(node, parentNode, fileId);

    this.index[this.generateCacheIndexKey(node.id, fileId)] = {
      nodeHash,
      filePath,
      downloadedAt: new Date().toISOString(),
      nodeId: node.id,
      nodeName: node.name || "unnamed",
      fileId,
    };

    await this.saveCacheIndex();

    console.log(
      cacheLogger(),
      green("✔"),
      `Cached ${cyan(node.name || node.id)} with hash ${yellow(nodeHash)}`
    );
  }

  /**
   * Clear all cache entries
   */
  async clearCache(): Promise<void> {
    try {
      await fs.rm(this.cacheDir, { recursive: true, force: true });
      this.index = {};
      console.log(cacheLogger(), green("✔"), "Cache cleared successfully");
    } catch (error) {
      console.error(cacheLogger(), "❌", "Failed to clear cache:", error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    cacheSize: string;
    oldestEntry: string | null;
    newestEntry: string | null;
  }> {
    await this.loadCacheIndex();

    const entries = Object.values(this.index);
    const totalEntries = entries.length;

    let cacheSize = "0 B";
    try {
      const stats = await fs.stat(this.cacheDir);
      cacheSize = this.formatBytes(stats.size);
    } catch {
      // Cache directory doesn't exist
    }

    const sortedByDate = entries.map((e) => e.downloadedAt).sort();

    return {
      totalEntries,
      cacheSize,
      oldestEntry: sortedByDate[0] || null,
      newestEntry: sortedByDate[sortedByDate.length - 1] || null,
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}
