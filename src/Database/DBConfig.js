//DBConfig.js|tsx

export const DBConfig = {
    name: "MyDB",
    version: 1,
    objectStoresMeta: [
      {
        store: "files",
        storeConfig: { keyPath: "name" },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: true } },
          { name: "data", keypath: "data", options: { unique: false } },
        ],
      },
    ],
  };
  
  