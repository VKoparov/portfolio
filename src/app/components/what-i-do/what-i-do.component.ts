import {AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {Observable} from "rxjs";

@Component({
    selector: 'app-what-i-do',
    templateUrl: './what-i-do.component.html',
    styleUrls: ['./what-i-do.component.scss']
})
export class WhatIDoComponent implements AfterViewInit, OnDestroy {

    templates: { imgSrc: string, logoUrl: string, header: string, action: Function }[] = [
        {
            imgSrc: 'assets/images/web-apps.jpg',
            logoUrl: 'assets/icons/logo.svg',
            header: 'Web Applications',
            action: () => {
                (document.getElementsByTagName('app-projects')[0] as HTMLElement)
                    .scrollIntoView({behavior: 'smooth'});
            }
        },
        {
            imgSrc: 'assets/images/freelance.jpg',
            logoUrl: 'assets/vectors/freelance.svg',
            header: 'Freelance',
            action: () => {
                window.open('https://www.fiverr.com/valentinkoparov/building-your-dream-website', '_blank');
            }
        },
        {
            imgSrc: 'assets/images/b2b.jpg',
            logoUrl: 'assets/vectors/b2b.svg',
            header: 'B2B',
            action: () => {
                window.location.href = "mailto:valentinkoparov.dev@gmail.com";
            }
        },
        {
            imgSrc: 'assets/images/education.jpg',
            logoUrl: 'assets/vectors/education.svg',
            header: 'Education',
            action: () => {
                window.open('https://sty.bz/', '_blank');
            }
        }
    ];

    @Input() event!: Observable<string>;

    @ViewChildren('revealCard') private cards!: QueryList<ElementRef<HTMLElement>>;
    private frame: number | null = null;
    private resizeObserver?: ResizeObserver;
    private readonly motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

    constructor(private readonly zone: NgZone) {}

    private readonly updateScroll = (): void => {
        if (this.frame !== null) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = null;
            const viewport = window.innerHeight;
            const mobile = window.matchMedia('(max-width: 60em)').matches;
            this.cards.forEach((card, index) => {
                // Measure the stationary slot, never the animated card inside it.
                const slot = card.nativeElement;
                const bounds = slot.getBoundingClientRect();
                const stagger = (mobile ? index % 2 : index) * viewport * 0.035;
                const distance = Math.max(1, Math.min(viewport * 0.55, bounds.height * 0.9));
                const progress = this.motionPreference.matches ? 1 :
                    Math.max(0, Math.min(1, (viewport * 0.92 - bounds.top - stagger) / distance));
                slot.style.setProperty('--card-progress', progress.toFixed(4));
            });
        });
    };

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver(this.updateScroll);
            this.cards.forEach(card => this.resizeObserver!.observe(card.nativeElement));
            window.addEventListener('scroll', this.updateScroll, {passive: true});
            window.addEventListener('resize', this.updateScroll, {passive: true});
            this.motionPreference.addEventListener('change', this.updateScroll);
            this.updateScroll();
        });
    }

    ngOnDestroy(): void {
        window.removeEventListener('scroll', this.updateScroll);
        window.removeEventListener('resize', this.updateScroll);
        this.motionPreference.removeEventListener('change', this.updateScroll);
        this.resizeObserver?.disconnect();
        if (this.frame !== null) cancelAnimationFrame(this.frame);
    }

    handleActionEvent(fun: Function): void {
        fun.call(this, fun);
    }
}
