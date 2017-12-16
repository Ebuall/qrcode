import { Injectable } from "@angular/core"
import { fromEvent } from "rxjs/observable/fromEvent"

interface ResultData {
  data: string
}

@Injectable()
export class QrcodeWorkerService {

  ww = new Worker("assets/qrcode_worker.js")
  message$ = fromEvent<ResultData>(this.ww, "message")

  constructor() {
    this.ww.postMessage({ cmd: "init" })
    this.ww.postMessage({ cmd: "hello_world" })
  }

  scanCode(size: number, imageData: ImageData) {
    this.ww.postMessage({
      cmd: "process",
      width: size,
      height: size,
      imageData,
    })
  }

}
