import { ElementRef } from "@angular/core"

export interface ProperElementRef<T> extends ElementRef {
  nativeElement: T
}

export type ElementRef<T> = ProperElementRef<T>
