import { Component, OnInit, Inject } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { StateService } from "../state.service"
import { delay } from "rxjs/operators"

interface Data {
  type: "DirectLink" | "SearchLink"
  content: string
  url: string
}

@Component({
  selector: "app-result-dialog",
  templateUrl: "./result-dialog.component.html",
  styleUrls: ["./result-dialog.component.css"],
})
export class ResultDialogComponent implements OnInit {

  constructor(
    public ref: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    readonly stateService: StateService,
  ) { }

  ngOnInit() {
    navigator.vibrate(200)
    this.stateService.paused$.next(true)

    this.ref.afterClosed()
      .pipe(delay(2000))
      .subscribe(() =>
        this.stateService.paused$.next(false))
  }

  isUrl(data = this.data) {
    return data.type === "DirectLink"
  }

  continue() {
    this.ref.close()
  }

}
