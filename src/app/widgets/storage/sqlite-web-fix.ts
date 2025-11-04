import {Capacitor} from "@capacitor/core";
import {CapacitorSQLite, SQLiteConnection} from "@capacitor-community/sqlite";

export async function ensureJeepSqliteReady() {
  if (Capacitor.getPlatform() === "web") {
    await customElements.whenDefined("jeep-sqlite");
    let jeepEl = document.querySelector("jeep-sqlite");
    if (!jeepEl) {
      jeepEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepEl);
    }
    (jeepEl as any).jeepSqliteWasmPath = "assets/sql-wasm/sql-wasm.wasm";
    await new Promise(res => setTimeout(res, 500));
    try {
      await CapacitorSQLite.initWebStore();
    } catch (e) {
      console.warn("⚠️ initWebStore non disponible, on continue...");
    }
  }
}

export async function createWebConnection(dbName: string) {
  await ensureJeepSqliteReady();
  const sqlite = new SQLiteConnection(CapacitorSQLite);
  const existingConn = await sqlite.isConnection(dbName, false);
  let db;
  if (existingConn.result) {
    db = await sqlite.retrieveConnection(dbName, false);
  } else {
    db = await sqlite.createConnection(dbName, false, "no-encryption", 1, false);
  }
  await db.open();
  return db;
}
