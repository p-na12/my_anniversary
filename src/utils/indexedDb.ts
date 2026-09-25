import type { MediaItem, MediaKind } from "../types";

const DB_NAME = "everafter-anniversary";
const STORE = "media";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: "id" });
        store.createIndex("kind", "kind");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function request<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE, mode);
    const result = action(transaction.objectStore(STORE));
    result.onsuccess = () => resolve(result.result);
    result.onerror = () => reject(result.error);
    transaction.oncomplete = () => db.close();
  });
}

export const mediaStorage = {
  async put(item: MediaItem) {
    await request("readwrite", (store) => store.put(item));
  },
  async get(id: string) {
    return request<MediaItem | undefined>("readonly", (store) => store.get(id));
  },
  async list(kind?: MediaKind): Promise<MediaItem[]> {
    if (!kind) return request("readonly", (store) => store.getAll());
    return request("readonly", (store) => store.index("kind").getAll(kind));
  },
  async remove(id: string) {
    await request("readwrite", (store) => store.delete(id));
  },
  async clear() {
    await request("readwrite", (store) => store.clear());
  },
};