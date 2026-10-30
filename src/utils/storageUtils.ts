/**
 * Robust Client Storage Utility for Cricket Tournament Hub
 * Uses IndexedDB as primary storage for large media & data (hundreds of MBs quota)
 * with safe LocalStorage fallback that never throws QuotaExceededError.
 */

const DB_NAME = 'ruchi_masters_db';
const DB_VERSION = 1;
const STORE_NAME = 'app_data';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a key-value pair to IndexedDB.
 * Supports large base64 strings and complex objects without 5MB quota restrictions.
 */
export async function saveToIndexedDB<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => {
        console.warn(`[IndexedDB] Error putting key "${key}":`, req.error);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn(`[IndexedDB] Failed to open DB for "${key}":`, err);
    return false;
  }
}

/**
 * Loads an item from IndexedDB by key.
 */
export async function loadFromIndexedDB<T>(key: string): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        resolve(req.result !== undefined ? (req.result as T) : null);
      };
      req.onerror = () => {
        console.warn(`[IndexedDB] Error getting key "${key}":`, req.error);
        resolve(null);
      };
    });
  } catch (err) {
    console.warn(`[IndexedDB] Failed to load "${key}":`, err);
    return null;
  }
}

/**
 * Safe wrapper around localStorage.setItem that catches QuotaExceededError
 * and prevents unhandled crashes.
 */
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`[LocalStorage] Quota exceeded or error saving "${key}". Falling back to IndexedDB.`, e);
    return false;
  }
}
