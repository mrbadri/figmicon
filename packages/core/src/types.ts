// src/types.ts
export type FigmiconConfig = {
  figmaToken: string;
  fileId: string;
  nodeIds: string[];
  outDir: string;
  optimize?: { svgo?: boolean };
  react?: {
    outDir: string;
    baseIconPath: string;
    svgrOptions?: Record<string, any>;
  };
  sprite?: {
    outDir: string;
    spriteFile: string;
    symbolPrefix?: string;
  };
};

// اجازه export یک defineConfig برای DX بهتر
export const defineConfig = (c: FigmiconConfig) => c;
