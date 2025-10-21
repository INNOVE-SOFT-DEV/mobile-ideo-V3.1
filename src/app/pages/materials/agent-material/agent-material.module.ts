import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {AgentMaterialPageRoutingModule} from "./agent-material-routing.module";

import {AgentMaterialPage} from "./agent-material.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AgentMaterialPageRoutingModule]
})
export class AgentMaterialPageModule {}
