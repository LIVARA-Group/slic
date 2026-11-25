export interface EnvironmentManifest {
  schemaVersion: 1;
  id: string;
  capturedAt: string;

  host: {
    os: {
      name: string;
      version: string;
      architecture: string;
    };
    cpu: {
      model: string;
      logicalCores: number;
    };
    memory: {
      totalBytes: number;
    };
    storage: {
      type: string | null;
      freeSpaceBytes: number | null;
    };
  };

  runtime: {
    name: string;
    version: string;
    flags: string[];
  };

  browser: {
    name: string;
    version: string;
  } | null;

  execution: {
    powerMode: string | null;
  };

  source: {
    commitSha: string | null;
    packageManager: {
      name: string;
      version: string;
    } | null;
  };
}
