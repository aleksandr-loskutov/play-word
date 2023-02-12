// eslint-disable-next-line max-classes-per-file
import { Locals } from './consts';

type TStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

abstract class Storage<T extends string> {
  private readonly storage: TStorage;

  public constructor(
    getStorage = (): TStorage => {
      if (typeof window !== 'undefined') return window.localStorage;
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }
  ) {
    this.storage = getStorage();
  }

  protected get(key: T): string | null {
    return this.storage.getItem(key);
  }

  protected set(key: T, value: string): void {
    this.storage.setItem(key, value);
  }

  protected clearItem(key: T): void {
    this.storage.removeItem(key);
  }

  protected clearItems(keys: T[]): void {
    keys.forEach(key => this.clearItem(key));
  }
}

class LocalStorage extends Storage<Locals> {
  private static instance?: LocalStorage;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new LocalStorage();
    }

    return this.instance;
  }

  public getOAuthProvider() {
    return this.get(Locals.OAUTH_PROVIDER);
  }

  public setOAuthProvider(OAuthProvider: string) {
    this.set(Locals.OAUTH_PROVIDER, OAuthProvider);
  }

  public clearOAuthProvider() {
    this.clearItems([Locals.OAUTH_PROVIDER]);
  }
}

export default LocalStorage.getInstance();
