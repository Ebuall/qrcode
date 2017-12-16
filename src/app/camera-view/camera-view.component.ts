import { Component, OnInit, ViewChild } from "@angular/core"
import { fromEvent } from "rxjs/observable/fromEvent"
import { map as maybeMap } from "@typed/maybe"
import { merge } from "rxjs/observable/merge"
import { BehaviorSubject } from "rxjs/BehaviorSubject"
import { auditTime } from "rxjs/operators"
import { animationFrame } from "rxjs/scheduler/animationFrame"

import { ElementRef } from "../types"
import { StateService } from "../state.service"

export interface Size {
  height: number
  width: number
}

@Component({
  selector: "app-camera-view",
  templateUrl: "./camera-view.component.html",
  styleUrls: ["./camera-view.component.css"],
})
export class CameraViewComponent implements OnInit {

  @ViewChild("video") elRef: ElementRef<HTMLVideoElement>
  el: HTMLVideoElement

  config$ = new BehaviorSubject<MediaStreamConstraints>({ video: { facingMode: "environment" } })

  constructor(readonly stateService: StateService) { }

  ngOnInit() {
    this.el = this.elRef.nativeElement

    this.stateService.deviceId$.subscribe(maybeMap(deviceId => this.config$.next({ video: { deviceId } })))
    this.stateService.deviceId$.subscribe(() => this.startVideoStream())

    merge(
      auditTime(0, animationFrame)(fromEvent<UIEvent>(window, "resize")),
      this.stateService.videoCanPlay$,
    ).subscribe(() => this.stateService.videoSize$.next({
      height: this.el.videoHeight,
      width: this.el.videoWidth,
    }))

    fromEvent(document, "visibilitychange")
      .subscribe(() => document.hidden
        ? this.stopVideoStream()
        : this.startVideoStream())
  }

  startVideoStream() {
    this.stopVideoStream()
    console.log("starting video")
    navigator.mediaDevices.getUserMedia(this.config$.value)
      .then(stream => {
        this.el.srcObject = stream
        fromEvent<void>(this.el, "canplay").subscribe(this.stateService.videoCanPlay$)
      })
      .catch(error =>
        alert(error.name + ": " + error.message))
  }

  stopVideoStream() {
    console.log("stopping video")
    if (this.el.srcObject) {
      this.el.srcObject.getTracks()[0].stop()
    }
  }
}
