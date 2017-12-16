import { Component, OnInit, ViewChild } from "@angular/core"
import { ElementRef } from "../types"
import { QrcodeWorkerService } from "../qrcode-worker.service"
import { StateService } from "../state.service"
import { take } from "rxjs/operators"

@Component({
  selector: "app-snapshot",
  templateUrl: "./snapshot.component.html",
  styleUrls: ["./snapshot.component.css"],
})
export class SnapshotComponent implements OnInit {
  snapshotSquare: { x: number; y: number; size: number; }

  @ViewChild("canvas") canvas: ElementRef<HTMLCanvasElement>
  ctx: CanvasRenderingContext2D
  @ViewChild("overlay") overlay: ElementRef<HTMLDivElement>

  videoWorks: boolean

  constructor(
    readonly qrcodeWorkerService: QrcodeWorkerService,
    readonly stateService: StateService,
  ) { }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext("2d")!

    this.stateService.videoSize$.subscribe(({ height, width }) => {
      const size = this.overlay.nativeElement.offsetWidth | 0
      this.snapshotSquare = {
        x: (width - size) / 2 | 0,
        y: (height - size) / 2 | 0,
        size,
      }
      const canvas = this.canvas.nativeElement
      canvas.width = canvas.height = size
    })

    this.stateService.capture$.subscribe(() => {
      const { size, x, y } = this.snapshotSquare
      const video = document.querySelector("video")! // 
      this.ctx.drawImage(video, x, y, size, size, 0, 0, size, size)
      const imageData = this.ctx.getImageData(0, 0, size, size)
      this.qrcodeWorkerService.scanCode(
        size,
        imageData,
      )
    })

    this.stateService.videoCanPlay$.pipe(take(1))
      .subscribe(() => this.videoWorks = true)
  }

}
