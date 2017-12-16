import { Component } from "@angular/core"
import { Maybe, map as maybeMap } from "@typed/maybe"
import { findIndex } from "lodash"

import { QrcodeWorkerService } from "./qrcode-worker.service"
import { MatDialog } from "@angular/material/dialog"
import { ResultDialogComponent } from "./result-dialog/result-dialog.component"
import { StateService } from "./state.service"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "app"

  videoWorks = false
  devices: MediaDeviceInfo[] = []
  disabledUI = false

  constructor(
    readonly qrcodeWorkerService: QrcodeWorkerService,
    readonly stateService: StateService,
    readonly dialog: MatDialog,
  ) {
    navigator.mediaDevices.enumerateDevices()
      .then((allDevices: MediaDeviceInfo[]) => {
        this.devices = allDevices.filter(device => device.kind === "videoinput")

        if (this.devices.length > 1) {
          this.stateService.deviceId$.next(Maybe.of(this.devices[0].deviceId))
        }
      })

    qrcodeWorkerService.message$.subscribe(resultData => this.showResult(resultData.data))
  }

  findNextCamera() {
    return maybeMap((deviceId: string) => {
      const old = findIndex(this.devices, { deviceId })
      return this.devices[(old + 1) % this.devices.length].deviceId
    }, this.stateService.deviceId$.value)
  }

  flipCamera() {
    this.stateService.deviceId$.next(this.findNextCamera())
  }

  showResult(content: string) {
    if (content) {
      let url, type
      try {
        url = String(new URL(content))
        type = "DirectLink"
      } catch (_) {
        url = "https://google.com/search?q=" + encodeURIComponent(content)
        type = "SearchLink"
      }

      this.dialog.open(ResultDialogComponent, {
        data: {
          content,
          type,
          url,
        },
      })
    } else {
      this.stateService.retry$.next()
    }
  }
}
