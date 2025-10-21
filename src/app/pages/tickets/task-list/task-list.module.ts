import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {IonicModule} from "@ionic/angular";
import {TaskListPageRoutingModule} from "./task-list-routing.module";
import {TaskListPage} from "./task-list.page";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, TaskListPageRoutingModule, TranslateModule],
  declarations: [TaskListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskListPageModule {}
