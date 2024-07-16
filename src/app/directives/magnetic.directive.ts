import {AfterViewInit, Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
    standalone: true,
    selector: '[appMagnetic]'
})
export class MagneticDirective implements AfterViewInit {

    strength: number = 100;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
        const magnetButton = this.elementRef.nativeElement;

        this.renderer.setStyle(
            magnetButton,
            'transition',
            `transform 0.3s ease-out`
        );
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const bounding = this.elementRef.nativeElement.getBoundingClientRect();
        const magnetButton = this.elementRef.nativeElement;

        const offsetX = (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * this.strength;
        const offsetY = (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * this.strength;

        this.renderer.setStyle(
            magnetButton,
            'transform',
            `translate(${offsetX}px, ${offsetY}px)`
        );
    }

    @HostListener('mouseout')
    onMouseOut() {
        const magnetButton = this.elementRef.nativeElement;
        this.renderer.setStyle(magnetButton, 'transform', 'translate(0, 0)');
    }
}
