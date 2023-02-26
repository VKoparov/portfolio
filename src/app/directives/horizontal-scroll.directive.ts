import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appHorizontalScroll]'
})
export class HorizontalScrollDirective {
  private isDragging = false;

  private startPosition = 0;

  private startScrollLeft = 0;

  constructor(private scrollContainer: ElementRef) {
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startPosition = event.clientX;
    this.startScrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const delta = event.clientX - this.startPosition;
      this.scrollContainer.nativeElement.scrollLeft = this.startScrollLeft - delta;
    }
  }

  @HostListener('mouseup') onMouseUp() {
    this.isDragging = false;
  }
}
