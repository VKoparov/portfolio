import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {LenisService} from '../../services/lenis.service';

@Component({
    selector: 'app-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
    host: {'[class.departing]': 'departing', '[class.expanding]': 'expanding'}
})
export class SplashScreenComponent implements AfterViewInit, OnDestroy {
    @Input() autoHideMs = 8000;
    @Output() closed = new EventEmitter<void>();
    @ViewChild('preview', {static: true}) preview!: ElementRef<HTMLElement>;
    @ViewChild('landingFrame') private landingFrame!: ElementRef<HTMLElement>;
    @ViewChildren('reelFrame') private reelFrames!: QueryList<ElementRef<HTMLElement>>;
    private frameAnimations: Animation[] = [];

    readonly frames = [
        'assets/images/splash/mountain-in-clouds.webp',
        'assets/images/splash/nicole-mason-misty-forest.webp',
        'assets/images/splash/norbert-buduczki-mountain-ridges.webp',
        'assets/images/splash/pascal-debrunner-coast.webp',
        'assets/images/splash/mona-jain-telephone-booths.webp',
        'assets/images/splash/valentin-koparov-valley.webp',
        'assets/background.webp'
    ];
    titleVisible = false;
    rolling = false;
    selected = false;
    expanding = false;
    departing = false;
    private disposed = false;
    private finishing = false;
    private timers = new Set<ReturnType<typeof setTimeout>>();
    private previousOverflow = '';

    constructor(private lenis: LenisService) {}

    async ngAfterViewInit(): Promise<void> {
        this.previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        this.lenis.pause();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.scrollY > 8) {
            await this.wait(100);
            this.finish();
            return;
        }

        // Bring in the title while preparing the reel; keep it over the moving images.
        const openingTitle = this.showOpeningTitle();

        // Load only the intro and hero assets; unrelated lazy images must not hold up entry.
        const hero = document.querySelector('app-homepage');
        const heroImages = Array.from(hero?.querySelectorAll('img') ?? []);
        const reelImages = this.frames.map(src => {
            const image = new Image();
            image.src = src;
            return image;
        });
        await Promise.race([
            Promise.allSettled([...heroImages, ...reelImages].map(image => image.decode())),
            this.wait(this.autoHideMs > 0 ? this.autoHideMs : 8000)
        ]);
        if (this.disposed || this.finishing) return;

        // Copy the rendered hero, including its responsive styles. No screenshot or second app.
        for (const selector of ['app-homepage', 'app-navigation-bar', 'app-social-block']) {
            const original = document.querySelector(selector);
            if (original) this.preview.nativeElement.appendChild(original.cloneNode(true));
        }
        for (const child of Array.from(this.preview.nativeElement.children)) {
            this.landingFrame.nativeElement.appendChild(child.cloneNode(true));
        }
        await openingTitle;
        await this.wait(120);
        if (this.disposed || this.finishing) return;
        this.rolling = true;
        this.animateFrames();
        await this.wait(2050);
        if (this.disposed || this.finishing) return;
        // Fade during the reel's final deceleration, before the framing corners arrive.
        this.titleVisible = false;
        await this.wait(650);
        if (this.disposed || this.finishing) return;
        this.selected = true;
        await this.wait(750);
        if (this.disposed || this.finishing) return;
        this.expanding = true;
        await this.wait(1700);
        this.finish();
    }

    private animateFrames(): void {
        const frames = this.reelFrames.toArray();
        const pitch = frames[0].nativeElement.offsetHeight + Math.max(36, window.innerHeight * 0.055);
        // Separate image planes follow a curved path through a shared focal point.
        // Every frame becomes flat and full size at center; the homepage ends exactly there.
        frames.forEach((frame, index) => {
            const keyframes: Keyframe[] = Array.from({length: 61}, (_, step) => {
                const position = -1 + this.frames.length * step / 60;
                const distance = index - position;
                const recession = Math.min(Math.abs(distance), 2);
                const x = Math.sin(distance * 0.9) * Math.min(48, window.innerWidth * 0.04);
                const tilt = Math.max(-12, Math.min(12, distance * -9));
                const roll = Math.sin(distance) * (index % 2 ? -3 : 3);
                return {
                    offset: step / 60,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${distance * pitch}px, ${-recession * 100}px) rotateX(${tilt}deg) rotateZ(${roll}deg) scale(${1 - recession * 0.07})`,
                    opacity: 1 - recession * 0.2
                };
            });
            this.frameAnimations.push(frame.nativeElement.animate(keyframes, {
                duration: 2600,
                easing: 'cubic-bezier(0.12, 0.65, 0.12, 1)',
                fill: 'forwards'
            }));
        });
    }

    private async showOpeningTitle(): Promise<void> {
        await this.wait(60);
        if (this.disposed || this.finishing) return;
        this.titleVisible = true;
        await this.wait(550);
    }

    finish(): void {
        if (this.disposed || this.finishing) return;
        this.finishing = true;
        this.departing = true;
        // Keep the live page stationary until the matching preview has faded away.
        this.wait(220).then(() => {
            if (this.disposed) return;
            this.restoreScroll();
            this.closed.emit();
        });
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => {
            const timer = setTimeout(() => { this.timers.delete(timer); resolve(); }, ms);
            this.timers.add(timer);
        });
    }

    private restoreScroll(): void {
        document.body.style.overflow = this.previousOverflow;
        this.lenis.resume();
    }

    ngOnDestroy(): void {
        this.disposed = true;
        this.frameAnimations.forEach(animation => animation.cancel());
        this.timers.forEach(timer => clearTimeout(timer));
        this.restoreScroll();
    }
}
