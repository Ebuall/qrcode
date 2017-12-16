import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"
import { ServiceWorkerModule } from "@angular/service-worker"
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from "@angular/material/dialog"
import { MatButtonModule } from "@angular/material/button"
import { MatProgressBarModule } from "@angular/material/progress-bar"
import { NoopAnimationsModule } from "@angular/platform-browser/animations"

import { environment } from "../environments/environment"
import { AppComponent } from "./app.component"
import { CameraViewComponent } from "./camera-view/camera-view.component"
import { SnapshotComponent } from "./snapshot/snapshot.component"
import { QrcodeWorkerService } from "./qrcode-worker.service"
import { ResultDialogComponent } from "./result-dialog/result-dialog.component"
import { StateService } from "./state.service"

@NgModule({
  declarations: [
    AppComponent,
    CameraViewComponent,
    SnapshotComponent,
    ResultDialogComponent,
  ],
  entryComponents: [ResultDialogComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register("/ngsw-worker.js", { enabled: environment.production }),
    NoopAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  providers: [
    QrcodeWorkerService,
    StateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
