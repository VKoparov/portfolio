import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appEnterTheViewportNotifier]'
})
export class EnterTheViewportNotifierDirective implements OnInit {

  @Output() visibilityChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() threshold: number = 0.7;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: this.threshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        this.visibilityChange.emit(entry.isIntersecting ? 'VISIBLE' : 'HIDDEN');
      });
    }, options);

    observer.observe(this.el.nativeElement);
  }
}
