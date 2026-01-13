// Service for managing offline video storage using IndexedDB

interface DownloadedVideo {
  id: string;
  videoId: string;
  title: string;
  description?: string;
  videoData: Blob;
  thumbnailUrl?: string;
  duration?: string;
  subject?: string;
  class?: string;
  downloadedAt: number;
}

class OfflineStorageService {
  private dbName = 'ViswamOTT';
  private dbVersion = 1;
  private storeName = 'videos';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
          objectStore.createIndex('videoId', 'videoId', { unique: false });
          objectStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        }
      };
    });
  }

  async saveVideo(video: DownloadedVideo): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(video);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to save video'));
      };
    });
  }

  async getVideo(videoId: string): Promise<DownloadedVideo | null> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('videoId');
      const request = index.get(videoId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get video'));
      };
    });
  }

  async getAllVideos(): Promise<DownloadedVideo[]> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error('Failed to get videos'));
      };
    });
  }

  async deleteVideo(videoId: string): Promise<void> {
    if (!this.db) {
      await this.init();
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('videoId');
      const request = index.getKey(videoId);

      request.onsuccess = () => {
        const key = request.result;
        if (key) {
          const deleteRequest = store.delete(key);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = () => reject(new Error('Failed to delete video'));
        } else {
          resolve();
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to find video'));
      };
    });
  }

  async isVideoDownloaded(videoId: string): Promise<boolean> {
    const video = await this.getVideo(videoId);
    return video !== null;
  }

  async getVideoUrl(videoId: string): Promise<string | null> {
    const video = await this.getVideo(videoId);
    if (!video) {
      return null;
    }
    return URL.createObjectURL(video.videoData);
  }
}

export const offlineStorage = new OfflineStorageService();






