import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {IonicModule} from "@ionic/angular";

import {OcrScannerPageRoutingModule} from "./ocr-scanner-routing.module";

import {OcrScannerPage} from "./ocr-scanner.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, OcrScannerPageRoutingModule, ReactiveFormsModule],
  declarations: [OcrScannerPage]
})
export class OcrScannerPageModule {}
