import {AfterViewInit, Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appHorizontalScrollSnap]',
})
export class HorizontalScrollSnapDirective implements AfterViewInit {
  private container!: HTMLElement;
  private items!: NodeListOf<HTMLElement>;
  private itemWidth!: number;
  private currentIndex = 0;

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    this.container = this.el.nativeElement;
    this.items = this.container.querySelectorAll('.scroll-item');
    this.itemWidth = this.items[0].clientWidth;
  }

  @HostListener('window:resize')
  onResize() {
    this.itemWidth = this.items[0].clientWidth;
  }

  moveLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.scrollToIndex(this.currentIndex);
    }
  }

  moveRight() {
    if (this.currentIndex < this.items.length) {
      this.currentIndex++;
      this.scrollToIndex(this.currentIndex);
    }
  }

  scrollToIndex(index: number) {
    this.container.scrollTo({
      left: index * this.itemWidth,
      behavior: 'smooth',
    });
  }
}
