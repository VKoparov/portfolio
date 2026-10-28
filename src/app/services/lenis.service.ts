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

        const isTouch = typeof window !== 'undefined'
            && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        const runtimeOpts: any = {...options};

        if (isTouch && !this.reducedMotion) {
            runtimeOpts.smoothTouch = false;
            runtimeOpts.syncTouch = false;
        }

        this.lenis = new Lenis(runtimeOpts as LenisOptions);

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
