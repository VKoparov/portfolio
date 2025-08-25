import {Injectable, NgZone, OnDestroy} from '@angular/core';
import Lenis, {LenisOptions} from 'lenis';

@Injectable({providedIn: 'root'})
export class LenisService implements OnDestroy {

    private lenis?: Lenis;

    private rafId?: number;

    private reducedMotion = false;

    constructor(private zone: NgZone) {}

    init(opts: LenisOptions = {}) {
        if (this.lenis) return this.lenis;

        this.reducedMotion = typeof matchMedia !== 'undefined'
            && matchMedia('(prefers-reduced-motion: reduce)').matches;

        const options: LenisOptions = {
            duration: 1.1,
            wheelMultiplier: 0.7,
            ...opts,
        };

        this.lenis = new Lenis(options);

        if (!this.reducedMotion) {
            this.zone.runOutsideAngular(() => {
                const loop = (t: number) => {
                    this.lenis!.raf(t);
                    this.rafId = requestAnimationFrame(loop);
                };
                this.rafId = requestAnimationFrame(loop);
            });
        }

        return this.lenis;
    }

    ngOnDestroy() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.lenis?.destroy();
        this.lenis = undefined;
    }
}
