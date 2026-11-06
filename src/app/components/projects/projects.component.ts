import {AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LenisService} from '../../services/lenis.service';
import {SwipeReminder} from '../../shared/swipe-reminder';
import {DescriptionScrollController} from '../../shared/description-scroll.controller';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {

    readonly descriptionScroll: DescriptionScrollController;

    @ViewChild('deckHintMarker') private deckHintMarker!: ElementRef<HTMLElement>;
    private readonly swipeReminder = new SwipeReminder(12);
    hintVisible = false;
    hintCoolingDown = false;
    touching = false;
    private hintObserver?: IntersectionObserver;
    private hintCooldownTimer?: ReturnType<typeof setTimeout>;
    private swipeDirection: 'next' | 'previous' | null = null;
    private swipeProgress = 0;
    private swipeSettling = false;
    private swipeSettleTimer?: ReturnType<typeof setTimeout>;

    constructor(lenis: LenisService, private readonly zone: NgZone) {
        this.descriptionScroll = new DescriptionScrollController(lenis);
    }

    intervalId!: any;
    readonly DURATION = 5000;
    readonly STEP = 50;
    elapsedTime = 0;
    progress = 0;
    isPaused = false;

    defaultTouch: any = {x: 0, y: 0, time: 0};

    projects: {
        identifier: string,
        type: string,
        header: string,
        description: string,
        imgSrc: string,
        url?: string
    }[] = [
        {
            identifier: 'slkdfjlk',
            type: 'web',
            header: 'Picante Social & Dance',
            description: 'I\'ve meticulously crafted a captivating website that pulsates with the vibrant energy of Latin dance. From sleek design to user-friendly functionality, every element reflects my passion for fostering community and connection through the art of dance.',
            imgSrc: 'assets/images/picante.png',
            url: 'https://www.picante.bg/home'
        },
        {
            identifier: 'sdn88lkjl',
            type: 'web',
            header: 'Agora Sofia',
            description: 'Designed and developed a sleek, modern website for the largest Japanese language academy in Sofia, Bulgaria. This project was a perfect blend of my love for Japanese culture and my passion for crafting intuitive user experiences. The website featured a fully responsive design, interactive course pages, and a streamlined schedule process tailored to the needs of language enthusiasts. Unfortunately, the client decided to part ways before the grand launch, leaving this project as an unreleased masterpiece in my portfolio. Sometimes, projects don’t see the light of day—but the lessons and skills gained shine brightly!',
            imgSrc: 'assets/images/agora-sofia.png',
            url: 'https://agora-opal.vercel.app/home'
        },
        {
            identifier: 'jpioerjlk',
            type: 'web',
            header: 'Yotpo Subscriptions',
            description: 'An intuitive subscription management solution that makes it easy for eCommerce brands to grow recurring revenue by adding a subscription offering.',
            imgSrc: 'assets/images/yotpo-subs.png',
            url: 'https://www.yotpo.com/platform/subscriptions/'
        },
        {
            identifier: 'huyosafdsf',
            type: 'web',
            header: 'Yotpo Integrations Center',
            description: 'Easily integrate Yotpo with the leading eCommerce apps and platforms to create seamless, engaging, and high-converting shopping experiences using rich customer data.',
            imgSrc: 'assets/images/integrations-center.png',
            url: 'https://www.yotpo.com/platform/subscriptions/'
        },
        {
            identifier: 'ertvnhj',
            type: 'web',
            header: 'VisualVest',
            description: 'VisualVest Platform – Investment Account & Banking Integration\n' +
                '\n' +
                'Worked on a large-scale fintech platform used by German cooperative banks to support digital investment account creation and management. Contributed to backend services responsible for handling depot (investment account) operations, customer eligibility, and integration with external banking systems such as Atruvia and Union Investment.\n' +
                '\n' +
                'Designed and implemented business-critical APIs for product availability, account creation flows, and support operations, ensuring alignment with complex banking rules and feature flags. Improved system reliability through robust validation, error handling, and test coverage.\n' +
                '\n' +
                'Collaborated across multiple services and teams to deliver scalable, production-ready solutions in a highly regulated financial environment.',
            imgSrc: 'assets/images/visualvest.png',
            url: 'https://www.visualvest.de/'
        },
        {
            identifier: 'we34thyh',
            type: 'web',
            header: 'Deutsche Bahn',
            description: 'Deutsche Bahn AG (DB) is Germany\'s state-owned national railway company, founded in 1994 and headquartered in Berlin. It operates Europe’s longest rail network, covering passenger (long-distance/regional) and freight transport, along with logistics services. As of 2026, it is focusing on infrastructure modernization while managing punctuality challenges and high demand.',
            imgSrc: 'assets/images/deutsche-bahn.png',
            url: 'https://www.bahn.de/'
        },
        {
            identifier: 'huqwefdsf',
            type: 'web',
            header: 'PeopleStrategy',
            description: 'From intuitive, hire-to-retire HR technology to comprehensive benefits consulting and HR services, PeopleStrategy offers employers a single source for the tools and services necessary to attract, manage and retain talent.',
            imgSrc: 'assets/images/peoplestrategy.png',
            url: 'https://www.peoplestrategy.com/'
        },
        {
            identifier: 'huqwefdsfrtfgfbh',
            type: 'web',
            header: 'Angular Intro',
            description: 'Angular Intro is a lightweight educational project showcasing the fundamentals of Angular application development alongside modern testing practices using Cypress.',
            imgSrc: 'assets/images/angular-intro.png',
            url: 'https://angular-intro-eight.vercel.app/home'
        },
        {
            identifier: 'rtyqwefdsf',
            type: 'web',
            header: 'Codexio ERP',
            description: 'An ERP (Enterprise Resource Planning) system is a comprehensive software platform that helps organizations manage and automate key business processes such as finance, inventory, production, and sales.',
            imgSrc: 'assets/images/erp-system.png',
            url: 'https://codexio.bg/'
        },
        {
            identifier: 'rtyqwefccc',
            type: 'apis',
            header: 'Material Minesweeper',
            description: 'Minesweeper, the classic puzzle game, has been given a modern take with updated style and new gameplay features, like colored tiles and more.',
            imgSrc: 'assets/images/material-minesweeper.png',
            url: 'https://minesweeper-material.vercel.app/'
        },
        {
            identifier: 'rtyqwefbbb',
            type: 'packs',
            header: 'Stream Kafka for NestJS',
            description: 'Stream Kafka for NestJS is a powerful tool that allows developers to easily implement Kafka messaging into their NestJS applications.',
            imgSrc: 'https://images.unsplash.com/photo-1516259657995-80d1e36154b5?q=80&w=1519&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'https://www.npmjs.com/package/stream-kafka'
        },
        {
            identifier: 'rtyqwefvvv',
            type: 'packs',
            header: 'SocksJS for Angular',
            description: 'Socket.IO inspired wrapper over Stomp Websocket for Angular.',
            imgSrc: 'https://images.unsplash.com/photo-1510672277783-ea03bdd8b602?q=80&w=2380&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'https://www.npmjs.com/package/ngx-socksjs'
        },
        {
            identifier: 'iushf8943s',
            type: 'web',
            header: 'Tune Keeper',
            description: 'A Spotify companion app that tracks how your playlists change over time. It detects and diffs additions and removals, and for collaborative playlists it attributes changes to contributors and supports an approve/reject workflow.',
            imgSrc: 'assets/images/tune-keeper.gif',
            url: 'https://tune-keeper.vercel.app/dashboard'
        }
    ];

    swipeProject: ProjectsComponent['projects'][number] | null = null;

    ngOnInit(): void {
        this.startTimer();

        this.doSwipeLeft();
        this.doSwipeRight();
    }

    ngAfterViewInit(): void {
        this.hintObserver = new IntersectionObserver(entries => {
            this.zone.run(() => this.hintVisible = entries.some(entry => entry.isIntersecting));
            this.syncSwipeHint();
        }, {threshold: 0.25});
        this.hintObserver.observe(this.deckHintMarker.nativeElement);
    }

    private syncSwipeHint(): void {
        const enabled = this.hintVisible && !this.hintCoolingDown && !this.touching &&
          window.matchMedia('(max-width: 992px)').matches &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.swipeReminder.update(enabled
          ? document.querySelector<HTMLElement>('#slide .item:nth-child(3) .project-preview-face') : null);
    }

    private pauseSwipeHint(): void {
        this.hintCoolingDown = true;
        this.syncSwipeHint();
        clearTimeout(this.hintCooldownTimer);
        this.hintCooldownTimer = setTimeout(() => {
            this.hintCoolingDown = false;
            this.syncSwipeHint();
        }, 12000);
    }

    ngOnDestroy(): void {
        this.swipeReminder.destroy();
        this.hintObserver?.disconnect();
        clearTimeout(this.hintCooldownTimer);
        clearTimeout(this.swipeSettleTimer);
        this.descriptionScroll.onTouchEnd();
        this.pauseTimer();
    }

    pauseTimer(): void {
        this.isPaused = true;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    resumeTimer(): void {
        this.isPaused = false;
        this.startInterval();
    }

    public startTimer(): void {
        this.pauseTimer();
        this.elapsedTime = 0;
        this.progress = 0;
        this.isPaused = false;
        this.startInterval();
    }

    private startInterval(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.intervalId = setInterval(() => {
            this.elapsedTime += this.STEP;
            this.progress = Math.min(100, (this.elapsedTime / this.DURATION) * 100);

            if (this.elapsedTime >= this.DURATION) {
                this.directionLeft(null);
            }
        }, this.STEP);
    }

    @HostListener('touchstart', ['$event'])
    @HostListener('touchmove', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event: any) {
        if (this.swipeSettling) return;
        const touch = this.getTouch(event);
        if (!touch) return;

        if (event.type === 'touchmove') {
            this.handleTouchMove(touch, event);
            return;
        }
        if (event.type === 'touchstart') {
            this.touching = true;
            this.syncSwipeHint();
            this.pauseTimer();
            this.handleTouchStart(touch, event.timeStamp);
            return;
        }

        if (event.type === 'touchend') {
            if (this.swipeDirection) {
                this.settleMobileSwipe(this.swipeProgress >= 0.28, event);
                return;
            }
            this.touching = false;
            this.handleTouchEnd(touch, event.timeStamp, event);
            if (this.isPaused) this.resumeTimer();
            this.syncSwipeHint();
            return;
        }
        if (event.type === 'touchcancel') {
            if (this.swipeDirection) {
                this.settleMobileSwipe(false, event);
                return;
            }
            this.touching = false;
            this.resumeTimer();
            this.syncSwipeHint();
        }
    }

    doSwipeLeft() {
        document.getElementById('next')!.onclick = () => {
            this.pauseSwipeHint();
            this.directionLeft(null);
        };
    }

    doSwipeRight() {
        document.getElementById('prev')!.onclick = () => {
            this.pauseSwipeHint();
            this.directionRight(null);
        };
    }

    private getTouch(event: any): Touch {
        return event.touches[0] || event.changedTouches[0];
    }

    private handleTouchStart(touch: Touch, timeStamp: number) {
        this.defaultTouch.x = touch.pageX;
        this.defaultTouch.y = touch.pageY;
        this.defaultTouch.time = timeStamp;
    }

    private handleTouchMove(touch: Touch, event: TouchEvent): void {
        if (!window.matchMedia('(max-width: 992px)').matches || event.touches.length !== 1) return;
        const deltaX = touch.pageX - this.defaultTouch.x;
        const deltaY = touch.pageY - this.defaultTouch.y;
        if (!this.swipeDirection && (Math.abs(deltaX) < 8 || Math.abs(deltaX) <= Math.abs(deltaY))) return;
        if (event.cancelable) event.preventDefault();
        const slide = document.getElementById('slide');
        if (!slide) return;
        const direction = deltaX < 0 ? 'next' : 'previous';
        if (!this.swipeProject || direction !== this.swipeDirection) {
            const incoming = slide.querySelector<HTMLElement>(direction === 'next' ? '.item:nth-child(3)' : '.item:first-child');
            const index = Number(incoming?.getAttribute('data-project-index'));
            this.swipeProject = this.projects[index] ?? null;
            const description = incoming?.querySelector<HTMLElement>('.des');
            if (description) description.scrollTop = 0;
        }
        this.swipeDirection = direction;
        this.swipeProgress = Math.min(1, Math.abs(deltaX) / Math.min(240, window.innerWidth * 0.6));
        slide.classList.add('is-dragging');
        slide.classList.toggle('swiping-next', this.swipeDirection === 'next');
        slide.classList.toggle('swiping-previous', this.swipeDirection === 'previous');
        slide.style.setProperty('--swipe-progress', String(this.swipeProgress));
        slide.parentElement?.style.setProperty('--swipe-progress', String(this.swipeProgress));
    }

    private settleMobileSwipe(commit: boolean, event: TouchEvent): void {
        const slide = document.getElementById('slide');
        const direction = this.swipeDirection;
        if (!slide || !direction) return;
        this.swipeSettling = true;
        this.pauseTimer();
        slide.classList.remove('is-dragging');
        // Capture the current interpolated geometry before changing the target.
        void slide.parentElement?.offsetWidth;
        slide.style.setProperty('--swipe-progress', commit ? '1' : '0');
        slide.parentElement?.style.setProperty('--swipe-progress', commit ? '1' : '0');
        if (commit) this.pauseSwipeHint();
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.swipeSettleTimer = setTimeout(() => {
            if (commit) {
                if (direction === 'next') this.directionLeft(event);
                else this.directionRight(event);
                // The incoming copy is already fully revealed; don't replay its entrance.
                slide.classList.add('swipe-completed');
            }
            slide.classList.remove('swiping-next', 'swiping-previous');
            slide.style.removeProperty('--swipe-progress');
            slide.parentElement?.style.removeProperty('--swipe-progress');
            this.swipeProject = null;
            this.swipeDirection = null;
            this.swipeProgress = 0;
            this.swipeSettling = false;
            this.touching = false;
            if (this.isPaused) this.resumeTimer();
            this.syncSwipeHint();
        }, reducedMotion ? 0 : 360);
    }

    private handleTouchEnd(touch: Touch, timeStamp: number, event: any) {
        const deltaX = touch.pageX - this.defaultTouch.x;
        const deltaY = touch.pageY - this.defaultTouch.y;
        const deltaTime = timeStamp - this.defaultTouch.time;

        if (Math.abs(deltaX) > Math.abs(deltaY) && this.isValidSwipe(deltaX, deltaTime)) {
            this.executeSwipeAction(deltaX, event);
        }
    }

    private isValidSwipe(deltaX: number, deltaTime: number): boolean {
        return deltaTime < 500 && Math.abs(deltaX) > 60;
    }

    private executeSwipeAction(deltaX: number, event: any) {
        this.pauseSwipeHint();
        if (deltaX > 0) {
            this.directionRight(event);
            return;
        }

        this.directionLeft(event);
    }

    private directionLeft(event: any) {
        const lists = document.querySelectorAll('.item');
        const slide = document.getElementById('slide');
        slide?.classList.remove('swipe-completed');
        if (slide && lists.length > 0) {
            slide.appendChild(lists[0]);
        }
        this.startTimer();
        this.syncSwipeHint();
    }

    private directionRight(event: any) {
        const lists = document.querySelectorAll('.item');
        const slide = document.getElementById('slide');
        slide?.classList.remove('swipe-completed');
        if (slide && lists.length > 0) {
            slide.prepend(lists[lists.length - 1]);
        }
        this.startTimer();
        this.syncSwipeHint();
    }
}
