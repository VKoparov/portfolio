import {Directive, ElementRef, Inject, Renderer2} from "@angular/core";
import {fromEvent, Observable} from "rxjs";
import {
  distinctUntilChanged,
  map,
  pairwise,
  startWith,
  takeUntil
} from "rxjs/operators";
import {WINDOW} from '@ng-web-apis/common';
import {DestroyService} from "../services/destroy.service";

@Directive({
  selector: "[sticky]",
  providers: [DestroyService]
})
export class StickyDirective {

  private THRESHOLD: number = 200;
  constructor(
    @Inject(DestroyService) destroy: Observable<void>,
    @Inject(WINDOW) windowRef: Window, renderer: Renderer2, {nativeElement}: ElementRef<HTMLElement>
  ) {
    fromEvent(windowRef, "scroll")
      .pipe(
        map(() => windowRef.scrollY),
        pairwise(),
        map(([prev, next]) => next < this.THRESHOLD || prev > next),
        distinctUntilChanged(),
        startWith(true),
        takeUntil(destroy)
      )
      .subscribe(stuck => {
        renderer.setAttribute(nativeElement, "data-stuck", String(stuck));
      });
  }
}
