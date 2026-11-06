import {LenisService} from '../services/lenis.service';

/** Assign each nested scroll gesture to either its content or the page. */
export class DescriptionScrollController {
  constructor(private readonly lenis: Pick<LenisService, 'settle'>, private readonly enabled = () => true) {}

  private descriptionTouch?: {
    element: HTMLElement; x: number; y: number;
    owner: 'page' | 'description' | null; overflow: string;
  };

  private canScrollDescription(element: HTMLElement, delta: number): boolean {
    if (!this.enabled() || !delta) return false;
    const max = element.scrollHeight - element.clientHeight;
    return max > 1 && (delta > 0 ? element.scrollTop < max - 1 : element.scrollTop > 1);
  }

  onWheel(event: WheelEvent): void {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const element = event.currentTarget as HTMLElement;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientHeight : 1);
    if (!this.canScrollDescription(element, delta)) return;
    event.preventDefault();
    event.stopPropagation();
    this.lenis.settle();
    // Consume the whole event here, including any remainder at the edge.
    element.scrollTop += delta;
  }

  onTouchStart(event: TouchEvent): void {
    this.onTouchEnd();
    if (event.touches.length !== 1) return;
    const element = event.currentTarget as HTMLElement;
    this.descriptionTouch = {
      element, x: event.touches[0].clientX, y: event.touches[0].clientY,
      owner: null, overflow: element.style.overflowY
    };
  }

  onTouchMove(event: TouchEvent): void {
    const gesture = this.descriptionTouch;
    if (!gesture || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const delta = gesture.y - touch.clientY;
    if (!gesture.owner) {
      // Decide on the first move, before the browser starts native scroll chaining.
      if (Math.max(Math.abs(delta), Math.abs(touch.clientX - gesture.x)) < 1) return;
      // Leave horizontal gestures to the carousel.
      if (Math.abs(touch.clientX - gesture.x) >= Math.abs(delta)) return;
      gesture.owner = this.canScrollDescription(gesture.element, delta) ? 'description' : 'page';
      if (gesture.owner === 'page') gesture.element.style.overflowY = 'hidden';
      else this.lenis.settle();
    }
    gesture.y = touch.clientY;
    if (gesture.owner === 'description') {
      if (event.cancelable) event.preventDefault();
      event.stopPropagation();
      gesture.element.scrollTop += delta;
    }
  }

  onTouchEnd(): void {
    if (this.descriptionTouch) {
      this.descriptionTouch.element.style.overflowY = this.descriptionTouch.overflow;
      this.descriptionTouch = undefined;
    }
  }

}
