import {Component, HostListener, OnInit} from '@angular/core';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    intervalId!: any;

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
            identifier: 'huqwefdsf',
            type: 'web',
            header: 'PeopleStrategy',
            description: 'From intuitive, hire-to-retire HR technology to comprehensive benefits consulting and HR services, PeopleStrategy offers employers a single source for the tools and services necessary to attract, manage and retain talent.',
            imgSrc: 'assets/images/peoplestrategy.png',
            url: 'https://www.peoplestrategy.com/'
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
        }
    ];

    ngOnInit(): void {
        this.startTimer();

        this.doSwipeLeft();
        this.doSwipeRight();
    }

    @HostListener('touchstart', ['$event'])
    @HostListener('touchend', ['$event'])
    @HostListener('touchcancel', ['$event'])
    handleTouch(event: any) {
        const touch = this.getTouch(event);

        if (event.type === 'touchstart') {
            this.handleTouchStart(touch, event.timeStamp);
            return;
        }

        if (event.type === 'touchend') {
            this.handleTouchEnd(touch, event.timeStamp, event);
            return;
        }
    }

    doSwipeLeft() {
        document.getElementById('next')!.onclick = () => {
            this.directionLeft(null);
        };
    }

    doSwipeRight() {
        document.getElementById('prev')!.onclick = () => {
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

    private handleTouchEnd(touch: Touch, timeStamp: number, event: any) {
        const deltaX = touch.pageX - this.defaultTouch.x;
        const deltaY = touch.pageY - this.defaultTouch.y;
        const deltaTime = timeStamp - this.defaultTouch.time;

        if (this.isValidSwipe(deltaX, deltaTime)) {
            this.executeSwipeAction(deltaX, event);
        }
    }

    private isValidSwipe(deltaX: number, deltaTime: number): boolean {
        return deltaTime < 500 && Math.abs(deltaX) > 60;
    }

    private executeSwipeAction(deltaX: number, event: any) {
        if (deltaX > 0) {
            this.directionRight(event);
            return;
        }

        this.directionLeft(event);
    }

    private directionLeft(event: any) {
        const lists = document.querySelectorAll('.item');
        document.getElementById('slide')!.appendChild(lists[0]);
        clearInterval(this.intervalId);
        this.startTimer();
    }

    private directionRight(event: any) {
        const lists = document.querySelectorAll('.item');
        document.getElementById('slide')!.prepend(lists[lists.length - 1]);
        clearInterval(this.intervalId);
        this.startTimer();
    }

    private startTimer(): void {
        this.intervalId = setInterval(() => {
            const lists = document.querySelectorAll('.item');
            document.getElementById('slide')!.appendChild(lists[0]);
        }, 5000);
    }
}
