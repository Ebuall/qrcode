import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs/BehaviorSubject"
import { Subject } from "rxjs/Subject"
import { Maybe } from "@typed/maybe"

import { Size } from "./camera-view/camera-view.component"
import { merge } from "rxjs/observable/merge"
import { filter, withLatestFrom, tap, auditTime } from "rxjs/operators"

@Injectable()
export class StateService {
  videoSize$ = new BehaviorSubject<Size>({ height: 0, width: 0 })
  videoCanPlay$ = new Subject<void>()
  deviceId$ = new BehaviorSubject(Maybe.of<string>(undefined))
  retry$ = new Subject<void>()
  paused$ = new BehaviorSubject(false)
  capture$ = new Subject<any>()

  constructor() {
    merge(
      this.videoCanPlay$,
      this.retry$,
      this.paused$.pipe(filter(x => !x)),
    ).pipe(
      withLatestFrom(this.paused$),
      filter(([_, paused]) => !paused),
      tap(() => console.log("capture")),
      auditTime(120),
    ).subscribe(this.capture$)
  }

}
