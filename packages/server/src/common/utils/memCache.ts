class CacheManager<T> {
  private static instance: CacheManager<any>;
  private cache: { [key: string]: { data: T; lastFetched: Date } } = {};

  private constructor() {}

  public static getInstance(): CacheManager<any> {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Fetch data from cache
  public get(key: string): T | null {
    if (this.cache[key]) {
      return this.cache[key].data;
    }
    return null;
  }

  // Store data to cache
  public set(key: string, data: T): void {
    this.cache[key] = {
      data,
      lastFetched: new Date(),
    };
  }

  // Check if the cache is stale
  public isStale(key: string): boolean {
    if (!this.cache[key] || !this.cache[key].lastFetched) return true;

    const now = new Date();
    return (
      now.getTime() - this.cache[key].lastFetched.getTime() >= 60 * 60 * 1000
    );
  }
}

export const cacheManager = CacheManager.getInstance();
