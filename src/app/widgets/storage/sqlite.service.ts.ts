import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Network} from "@capacitor/network";
import {Capacitor} from "@capacitor/core";
import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from "@capacitor-community/sqlite";
import {environment} from "src/environments/environment";
import {createWebConnection} from "src/app/widgets/storage/sqlite-web-fix";

@Injectable({
  providedIn: "root"
})
export class SqliteServiceTs {
  private db!: SQLiteDBConnection;
  private connected = false;
  private sqliteConnection!: SQLiteConnection;
  private apiUrl = environment.urlAPI;
  private initialized = false;

  constructor(private http: HttpClient) {
    this.initNetwork();
  }

  private async initNetwork() {
    const status = await Network.getStatus();
    this.connected = status.connected;
    Network.addListener("networkStatusChange", st => (this.connected = st.connected));
  }

  async initDB() {
    if (this.initialized) {
      // console.log("SQLite déjà initialisé, on ignore.");
      return;
    }

    try {
      const dbName = "offline_db";
      if (Capacitor.getPlatform() === "web") {
        this.db = await createWebConnection(dbName);
      } else {
        this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
        const existingConn = await this.sqliteConnection.isConnection(dbName, false);
        if (existingConn.result) {
          this.db = await this.sqliteConnection.retrieveConnection(dbName, false);
        } else {
          this.db = await this.sqliteConnection.createConnection(dbName, false, "no-encryption", 1, false);
        }

        await this.db.open();
      }

      await this.db.execute(`
        CREATE TABLE IF NOT EXISTS sync_meta (
          table_name TEXT PRIMARY KEY,
          last_push TEXT,
          last_pull TEXT
        );

        CREATE TABLE IF NOT EXISTS absences (
          id INTEGER PRIMARY KEY,
          data TEXT,
          operation TEXT,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          synced INTEGER DEFAULT 0
        );
      `);

      this.initialized = true;
      // console.log("SQLite initialisé et prêt !");
    } catch (err) {
      console.error("❌ Erreur SQLite init:", err);
    }
  }

  async listTables() {
    try {
      if (!this.db) {
        console.warn("⚠️ Base de données non initialisée !");
        return;
      }
      const res = await this.db.query("SELECT name FROM sqlite_master WHERE type='table';");
      // console.log("📋 Tables dans la base :", res.values);
    } catch (e) {
      console.error("❌ Erreur lors de la récupération des tables :", e);
    }
  }

  async ensureDBReady() {
    if (!this.initialized) {
      await this.initDB();
    }
  }

  private async getSyncMeta(table: string) {
    await this.ensureDBReady();
    const res = await this.db.query(`SELECT * FROM sync_meta WHERE table_name = ?`, [table]);
    if (res.values?.length) return res.values[0];
    await this.db.run(`INSERT INTO sync_meta (table_name, last_push, last_pull) VALUES (?, ?, ?)`, [table, null, null]);
    return {table_name: table, last_push: null, last_pull: null};
  }

  private async setSyncMeta(table: string, type: "push" | "pull") {
    await this.ensureDBReady();
    const now = new Date().toISOString();
    const col = type === "push" ? "last_push" : "last_pull";
    await this.db.run(`UPDATE sync_meta SET ${col} = ? WHERE table_name = ?`, [now, table]);
  }

  async insert(table: string, id: number, data: any) {
    await this.ensureDBReady();
    await this.db.run(
      `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
       VALUES (?, ?, 'create', datetime('now'), 0)`,
      [id, JSON.stringify(data)]
    );
  }

  async update(table: string, id: number, data: any) {
    await this.ensureDBReady();
    await this.db.run(
      `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
       VALUES (?, ?, 'update', datetime('now'), 0)`,
      [id, JSON.stringify(data)]
    );
  }

  async delete(table: string, id: number) {
    await this.ensureDBReady();
    await this.db.run(
      `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
       VALUES (?, NULL, 'delete', datetime('now'), 0)`,
      [id]
    );
  }

  async getAll(table: string) {
    await this.ensureDBReady();
    const res = await this.db.query(`SELECT * FROM ${table} WHERE operation != 'delete' OR operation IS NULL`);
    return res.values?.map(r => ({...r, data: JSON.parse(r.data)})) || [];
  }

  async getUnsynced(table: string) {
    await this.ensureDBReady();
    const res = await this.db.query(`SELECT * FROM ${table} WHERE synced = 0`);
    return res.values || [];
  }

  async markAsSynced(table: string, id: number) {
    await this.ensureDBReady();
    await this.db.run(`UPDATE ${table} SET synced = 1, operation = NULL WHERE id = ?`, [id]);
  }

  async smartFetch(table: string, endpoint: string): Promise<any[]> {
    await this.ensureDBReady();

    if (this.connected) {
      try {
        const apiData: any = await this.http.get(`${this.apiUrl}${endpoint}`).toPromise();
        for (const item of apiData) {
          await this.db.run(
            `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
             VALUES (?, ?, NULL, datetime('now'), 1)`,
            [item.id, JSON.stringify(item)]
          );
        }
        await this.setSyncMeta(table, "pull");
        return apiData;
      } catch {
        const local = await this.getAll(table);
        return local.map(r => r.data);
      }
    } else {
      const local = await this.getAll(table);
      return local.map(r => r.data);
    }
  }

  async smartSave(table: string, endpoint: string, data: any, method: "create" | "update" | "delete") {
    await this.ensureDBReady();
    if (this.connected) {
      try {
        let res;
        if (method === "delete") res = await this.http.delete(`${this.apiUrl}${endpoint}/${data.id}`).toPromise();
        else if (method === "update") res = await this.http.put(`${this.apiUrl}${endpoint}/${data.id}`, data).toPromise();
        else res = await this.http.post(`${this.apiUrl}${endpoint}`, data).toPromise();

        await this.db.run(
          `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
           VALUES (?, ?, NULL, datetime('now'), 1)`,
          [data.id, JSON.stringify(res || data)]
        );
        await this.setSyncMeta(table, "push");
        return res;
      } catch (err) {
        console.warn("Erreur API → sauvegarde locale", err);
      }
    }

    if (method === "create") await this.insert(table, data.id, data);
    if (method === "update") await this.update(table, data.id, data);
    if (method === "delete") await this.delete(table, data.id);

    return data;
  }

  async syncTable(table: string, endpoint: string) {
    await this.ensureDBReady();

    if (!this.connected) {
      console.warn(`Sync impossible (${table} offline)`);
      return;
    }

    const meta = await this.getSyncMeta(table);
    const unsynced = await this.getUnsynced(table);

    for (const item of unsynced) {
      try {
        if (item.operation === "create") {
          await this.http.post(`${this.apiUrl}${endpoint}/sync_push`, item.data).toPromise();
        } else if (item.operation === "update") {
          await this.http.put(`${this.apiUrl}${endpoint}/sync_push/${item.id}`, item.data).toPromise();
        } else if (item.operation === "delete") {
          await this.http.delete(`${this.apiUrl}${endpoint}/sync_push/${item.id}`).toPromise();
        }
        await this.markAsSynced(table, item.id);
      } catch (err) {
        console.warn(`Erreur sync ${table}`, err);
      }
    }

    await this.setSyncMeta(table, "push");

    try {
      const since = meta.last_pull ? `?since=${encodeURIComponent(meta.last_pull)}` : "";
      const apiData: any = await this.http.get(`${this.apiUrl}${endpoint}/sync_pull${since}`).toPromise();
      for (const record of apiData) {
        await this.db.run(
          `INSERT OR REPLACE INTO ${table} (id, data, operation, updated_at, synced)
           VALUES (?, ?, NULL, datetime('now'), 1)`,
          [record.id, JSON.stringify(record)]
        );
      }
      await this.setSyncMeta(table, "pull");
      // console.log(`✅ Sync terminée pour ${table}`);
    } catch (err) {
      console.error(`Erreur pull ${table}`, err);
    }
  }
}
