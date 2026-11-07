import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {LenisService} from '../../services/lenis.service';
import {DescriptionScrollController} from '../../shared/description-scroll.controller';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {

    readonly descriptionScroll: DescriptionScrollController;

    private visibilityObserver?: IntersectionObserver;
    private sceneNearby = true;
    private readonly syncPlayback = (): void => {
        this.clearTimer();
        if (this.sceneNearby && !document.hidden && !this.isPaused) this.startInterval();
    };

    @ViewChild('timeProgress', {static: true}) private timeProgress!: ElementRef<HTMLElement>;
    @ViewChild('slide') private slide!: ElementRef<HTMLElement>;

    constructor(lenis: LenisService, private readonly zone: NgZone) {
        this.descriptionScroll = new DescriptionScrollController(lenis);
    }

    intervalId!: any;
    readonly DURATION = 5000;
    readonly STEP = 50;
    elapsedTime = 0;
    private progressValue = 0;
    get progress(): number { return this.progressValue; }
    set progress(value: number) {
        this.progressValue = value;
        if (this.timeProgress) {
            this.timeProgress.nativeElement.style.transform = `scaleX(${value / 100})`;
        }
    }
    isPaused = false;

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
            imgSrc: 'assets/images/picante.webp',
            url: 'https://www.picante.bg/home'
        },
        {
            identifier: 'sdn88lkjl',
            type: 'web',
            header: 'Agora Sofia',
            description: 'Designed and developed a sleek, modern website for the largest Japanese language academy in Sofia, Bulgaria. This project was a perfect blend of my love for Japanese culture and my passion for crafting intuitive user experiences. The website featured a fully responsive design, interactive course pages, and a streamlined schedule process tailored to the needs of language enthusiasts. Unfortunately, the client decided to part ways before the grand launch, leaving this project as an unreleased masterpiece in my portfolio. Sometimes, projects don’t see the light of day—but the lessons and skills gained shine brightly!',
            imgSrc: 'assets/images/agora-sofia.webp',
            url: 'https://agora-opal.vercel.app/home'
        },
        {
            identifier: 'jpioerjlk',
            type: 'web',
            header: 'Yotpo Subscriptions',
            description: 'An intuitive subscription management solution that makes it easy for eCommerce brands to grow recurring revenue by adding a subscription offering.',
            imgSrc: 'assets/images/yotpo-subs.webp',
            url: 'https://www.yotpo.com/platform/subscriptions/'
        },
        {
            identifier: 'huyosafdsf',
            type: 'web',
            header: 'Yotpo Integrations Center',
            description: 'Easily integrate Yotpo with the leading eCommerce apps and platforms to create seamless, engaging, and high-converting shopping experiences using rich customer data.',
            imgSrc: 'assets/images/integrations-center.webp',
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
            imgSrc: 'assets/images/visualvest.webp',
            url: 'https://www.visualvest.de/'
        },
        {
            identifier: 'we34thyh',
            type: 'web',
            header: 'Deutsche Bahn',
            description: 'Deutsche Bahn AG (DB) is Germany\'s state-owned national railway company, founded in 1994 and headquartered in Berlin. It operates Europe’s longest rail network, covering passenger (long-distance/regional) and freight transport, along with logistics services. As of 2026, it is focusing on infrastructure modernization while managing punctuality challenges and high demand.',
            imgSrc: 'assets/images/deutsche-bahn.webp',
            url: 'https://www.bahn.de/'
        },
        {
            identifier: 'huqwefdsf',
            type: 'web',
            header: 'PeopleStrategy',
            description: 'From intuitive, hire-to-retire HR technology to comprehensive benefits consulting and HR services, PeopleStrategy offers employers a single source for the tools and services necessary to attract, manage and retain talent.',
            imgSrc: 'assets/images/peoplestrategy.webp',
            url: 'https://www.peoplestrategy.com/'
        },
        {
            identifier: 'huqwefdsfrtfgfbh',
            type: 'web',
            header: 'Angular Intro',
            description: 'Angular Intro is a lightweight educational project showcasing the fundamentals of Angular application development alongside modern testing practices using Cypress.',
            imgSrc: 'assets/images/angular-intro.webp',
            url: 'https://angular-intro-eight.vercel.app/home'
        },
        {
            identifier: 'rtyqwefdsf',
            type: 'web',
            header: 'Codexio ERP',
            description: 'An ERP (Enterprise Resource Planning) system is a comprehensive software platform that helps organizations manage and automate key business processes such as finance, inventory, production, and sales.',
            imgSrc: 'assets/images/erp-system.webp',
            url: 'https://codexio.bg/'
        },
        {
            identifier: 'rtyqwefccc',
            type: 'apis',
            header: 'Material Minesweeper',
            description: 'Minesweeper, the classic puzzle game, has been given a modern take with updated style and new gameplay features, like colored tiles and more.',
            imgSrc: 'assets/images/material-minesweeper.webp',
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
            imgSrc: 'assets/images/tune-keeper.webp',
            url: 'https://tune-keeper.vercel.app/dashboard'
        }
    ];

    activeProject = this.projects[1];

    ngOnInit(): void {
        this.startTimer();
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.visibilityObserver = new IntersectionObserver(entries => {
                this.sceneNearby = entries[0].isIntersecting;
                this.syncPlayback();
            }, {rootMargin: '100% 0px'});
            this.visibilityObserver.observe(this.slide.nativeElement);
            document.addEventListener('visibilitychange', this.syncPlayback);
        });
    }

    ngOnDestroy(): void {
        this.visibilityObserver?.disconnect();
        document.removeEventListener('visibilitychange', this.syncPlayback);
        this.descriptionScroll.onTouchEnd();
        this.pauseTimer();
    }

    pauseTimer(): void {
        this.isPaused = true;
        this.clearTimer();
    }

    private clearTimer(): void {
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
        this.clearTimer();
        if (!this.sceneNearby || document.hidden || this.isPaused) return;
        // Keep the 20Hz timer out of Angular's application-wide change detection.
        // Only actual project changes need to update the template.
        this.zone.runOutsideAngular(() => {
            this.intervalId = setInterval(() => {
                this.elapsedTime += this.STEP;
                this.progress = Math.min(100, (this.elapsedTime / this.DURATION) * 100);

                if (this.elapsedTime >= this.DURATION) {
                    this.zone.run(() => this.nextProject());
                }
            }, this.STEP);
        });
    }

    nextProject(): void {
        const slide = this.slide.nativeElement;
        if (slide.firstElementChild) slide.appendChild(slide.firstElementChild);
        this.finishNavigation();
    }

    previousProject(): void {
        const slide = this.slide.nativeElement;
        if (slide.lastElementChild) slide.prepend(slide.lastElementChild);
        this.finishNavigation();
    }

    private finishNavigation(): void {
        const activeId = this.slide.nativeElement.children[1]?.getAttribute('data-project-id');
        this.activeProject = this.projects.find(project => project.identifier === activeId) ?? this.activeProject;
        const description = this.slide.nativeElement.querySelector<HTMLElement>('.item:nth-child(2) .des');
        if (description) description.scrollTop = 0;
        this.startTimer();
    }
}
