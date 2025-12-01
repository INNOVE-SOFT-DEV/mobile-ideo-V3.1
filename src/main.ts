import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from "./app/app.module";
import "jeep-sqlite/dist/components/jeep-sqlite.js";
import {defineCustomElements as jeepSqlite} from "jeep-sqlite/loader";
import { defineCustomElements as ce } from '@ionic/pwa-elements/loader';


// ⚡ On attend que le DOM soit chargé avant de lancer Angular
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 DOM prêt — définition du composant jeep-sqlite");
  jeepSqlite(window);

  // On s’assure qu’il est bien défini
  ce(window);


  await customElements.whenDefined("jeep-sqlite");

  // On le crée dans le DOM si nécessaire
  if (!document.querySelector("jeep-sqlite")) {
    const el = document.createElement("jeep-sqlite");
    document.body.appendChild(el);
    console.log("✅ Composant <jeep-sqlite> ajouté au DOM manuellement");
  }

  // Ensuite on démarre Angular
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
