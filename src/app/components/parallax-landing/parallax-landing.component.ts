import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    OnDestroy,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './parallax-landing.component.html',
    styleUrls: ['./parallax-landing.component.scss'],
})
export class ParallaxLandingComponent implements AfterViewInit, OnDestroy {

    @ViewChild('dark', {static: true}) darkRef!: ElementRef<HTMLElement>;
    @ViewChild('logoImg', {static: true}) logoRef!: ElementRef<HTMLElement>;
    @ViewChild('fgDiv', {static: true}) fgRef!: ElementRef<HTMLElement>;

    private rafId: number | null = null;

    private zoomEndPx = 500;
    private maxLogo = 1.8;
    private maxFg = 1.8;

    constructor(private zone: NgZone) {
    }

    ngAfterViewInit(): void {
        this.updateFrame(this.getScrollY());

        this.zone.runOutsideAngular(() => {
            const loop = () => {
                this.updateFrame(this.getScrollY());
                this.rafId = requestAnimationFrame(loop);
            };
            this.rafId = requestAnimationFrame(loop);
        });
    }

    ngOnDestroy(): void {
        if (this.rafId != null) cancelAnimationFrame(this.rafId);
    }

    private getScrollY(): number {
        return window.scrollY || document.documentElement.scrollTop || 0;
    }

    private updateFrame(scrollTop: number) {
        // Foreground zoom (faster)
        const fgZoomFactor = 0.7;
        const fgZoom = this.calculateZoom(scrollTop, fgZoomFactor, this.maxFg);

        // Logo zoom (slower)
        const logoZoomFactor = 0.2;
        const logoZoom = this.calculateZoom(scrollTop, logoZoomFactor, this.maxLogo);

        // bottom offset
        const bottomOffset = scrollTop <= 0 ? '0px' : `-${scrollTop}px`;

        // dark overlay shade
        const overlayAlpha = Math.max(0, Math.min(1, fgZoom - 1));

        const dark = this.darkRef.nativeElement;
        const logo = this.logoRef.nativeElement;
        const fg = this.fgRef.nativeElement;

        dark.style.top = bottomOffset;
        dark.style.background = `rgba(0, 0, 0, ${overlayAlpha})`;
        fg.style.transform = `scale(${fgZoom})`;
        logo.style.transform = `scale(${logoZoom})`;
    }

    private calculateZoom(scrollTop: number, zoomFactor: number, maxZoom: number): number {
        const clamped = Math.max(0, Math.min(1, scrollTop / this.zoomEndPx));
        const zoom = 1 + clamped * zoomFactor;
        return Math.min(maxZoom, zoom);
    }
}
