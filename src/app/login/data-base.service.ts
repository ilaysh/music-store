import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { userModel } from './userModel';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private db: AngularIndexedDB;
  private dbName = 'musicStore';
  private dbVersion = 2;
  private storeName = 'users';

  constructor() {
    this.db = new AngularIndexedDB(this.dbName, this.dbVersion);
    this.db.openDatabase(this.dbVersion, (evt, db) => {
      if (db) {
        console.log('Upgrade needed, checking object store...');
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          console.log(`Creating object store: ${this.storeName}`);
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      }
    }).then(() => {
      console.log('Database initialized successfully');
    }).catch(error => {
      console.error('Error initializing database', error);
    });
  }

  createUser(user: userModel): Observable<boolean> {
    return from(this.db.add(this.storeName, user).then((res) => {
      return !!res;
    }).catch((err) => { 
      console.error('Error creating user:', err);
      return false;
    }));
  }

  getUser(username: string): Observable<userModel | null> {
    return from(this.db.getAll(this.storeName).then(users => {
      return users.find((user: userModel) => user.username === username) || null;
    }).catch((err) => { 
      console.error('Error retrieving user:', err);
      return null;
    }));
  }
}

export class AngularIndexedDB {
  utils: Utils;
  dbWrapper: DbWrapper;

  constructor(dbName: string, version: number) {
    this.utils = new Utils();
    this.dbWrapper = new DbWrapper(dbName, version);
  }

  openDatabase(version: number, upgradeCallback?: (e: IDBVersionChangeEvent, db: IDBDatabase) => void) {
    let self = this;
    return new Promise<any>((resolve, reject) => {
      this.dbWrapper.dbVersion = version;
      if (!self.utils.indexedDB)
        return reject('IndexedDB is not supported');

      let request = self.utils.indexedDB.open(this.dbWrapper.dbName, version);
      
      request.onsuccess = function (e) {
        self.dbWrapper.db = request.result;
        console.log('Database opened successfully');
        resolve(true);
      };

      request.onerror = function (e) {
        console.error('Error opening database', e);
        reject('IndexedDB error: ' + ((<any>e.target).errorCode ? (<any>e.target).errorCode + ' (' + (<any>e.target).error + ')' : (<any>e.target).errorCode));
      };

      request.onupgradeneeded = function (e: IDBVersionChangeEvent) {
        self.dbWrapper.db = request.result;
        console.log('Upgrading database...');
        if (typeof upgradeCallback === "function") {
          upgradeCallback(e, self.dbWrapper.db);
        }
      };
    });
  }

  getByKey(storeName: string, key: any) {
    let self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      let transaction = self.dbWrapper.createTransaction({
        storeName: storeName,
        dbMode: "readonly",
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve(true);
        }
      }),
      objectStore = transaction.objectStore(storeName),
      request: IDBRequest;

      request = objectStore.get(key);
      request.onsuccess = function (event: Event) {
        resolve((<any>event.target).result);
      };
    });
  }

  getAll(storeName: string, keyRange?: IDBKeyRange, indexDetails?: IndexDetails) {
    let self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      let transaction = self.dbWrapper.createTransaction({
        storeName: storeName,
        dbMode: "readonly",
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {}
      }),
      objectStore = transaction.objectStore(storeName),
      result: Array<any> = [],
      request: IDBRequest;

      if (indexDetails) {
        let index = objectStore.index(indexDetails.indexName),
          order = (indexDetails.order === 'desc') ? 'prev' : 'next';
        request = index.openCursor(keyRange, <IDBCursorDirection>order);
      } else {
        request = objectStore.openCursor(keyRange);
      }

      request.onerror = function (e) {
        reject(e);
      };

      request.onsuccess = function (evt: Event) {
        let cursor: any = (<IDBOpenDBRequest>evt.target).result;
        if (cursor) {
          result.push(cursor.value);
          cursor.continue();
        } else {
          resolve(result);
        }
      };
    });
  }

  add(storeName: string, value: any, key?: any) {
    let self = this;
    return new Promise<any>((resolve, reject) => {
      self.dbWrapper.validateBeforeTransaction(storeName, reject);

      let transaction = self.dbWrapper.createTransaction({
        storeName: storeName,
        dbMode: "readwrite",
        error: (e: Event) => {
          reject(e);
        },
        complete: (e: Event) => {
          resolve({ key: key, value: value });
        }
      }),
      objectStore = transaction.objectStore(storeName);

      let request = objectStore.add(value, key);
      request.onsuccess = (evt: any) => {
        key = evt.target.result;
      };
    });
  }

  // Remaining methods (update, delete, openCursor, clear, getByIndex) should be kept as they are

  // ...
}

export class Utils {
  indexedDB: IDBFactory | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.indexedDB = window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
    }
  }
}

export interface IndexDetails {
  indexName: string;
  order: string;
}

export class DbWrapper {
  dbName: string;
  dbVersion: number;
  db: IDBDatabase | null = null;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.dbVersion = version || 1;
    this.db = null;
  }

  validateStoreName(storeName: string) {
    if (this.db == null) return false;
    return this.db.objectStoreNames.contains(storeName);
  }

  validateBeforeTransaction(storeName: string, reject: Function) {
    if (!this.db) {
      reject('You need to use the openDatabase function to create a database before you query it!');
    }
    if (!this.validateStoreName(storeName)) {
      reject(('objectStore does not exist: ' + storeName));
    }
  }

  createTransaction(options: { storeName: string, dbMode: IDBTransactionMode, error: (e: Event) => any, complete: (e: Event) => any, abort?: (e: Event) => any }): IDBTransaction {
    let trans: IDBTransaction | null = this.db?.transaction(options.storeName, options.dbMode) || null;
    if (trans) {
      trans.onerror = options.error;
      trans.oncomplete = options.complete;
      trans.onabort = options.abort || null;
      return trans;
    }
    throw new Error("Transaction creation failed");
  }
}
