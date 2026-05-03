// ========== STORAGE ADAPTER ==========
// Storage adapter for diary management (local/remote)

class StorageAdapter {
  async getDiary(date) {}
  async saveDiary(date, content) {}
  async listDiaries() {}
  async uploadImage(base64) {}
}

class LocalStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.dbName = 'travel-guide-db';
    this.storeName = 'diaries';
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'date' });
        }
      };
    });
  }

  async getDiary(date) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(date);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || { content: '' });
      };
    });
  }

  async saveDiary(date, content) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ date, content, updated_at: new Date().toISOString() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve({ ok: true });
      };
    });
  }

  async listDiaries() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(request.result || []);
      };
    });
  }

  async uploadImage(base64) {
    // For local storage, just return the base64 data URL
    return { ok: true, url: base64 };
  }
}

class RemoteStorageAdapter extends StorageAdapter {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
  }

  async getDiary(date) {
    const response = await fetch(`${this.baseUrl}/api/diary?date=${encodeURIComponent(date)}`);
    return response.json();
  }

  async saveDiary(date, content) {
    const response = await fetch(`${this.baseUrl}/api/diary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, content })
    });
    return response.json();
  }

  async listDiaries() {
    const response = await fetch(`${this.baseUrl}/api/diary-files`);
    const data = await response.json();
    return data.files || [];
  }

  async uploadImage(base64) {
    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64 })
    });
    return response.json();
  }
}

// Global storage adapter instance
let storageAdapter = null;

function getStorageAdapter() {
  if (!storageAdapter) {
    const config = journeyConfig?.features?.diary;
    if (config?.storage === 'remote' && config?.backend_url) {
      storageAdapter = new RemoteStorageAdapter(config.backend_url);
    } else {
      storageAdapter = new LocalStorageAdapter();
    }
  }
  return storageAdapter;
}
