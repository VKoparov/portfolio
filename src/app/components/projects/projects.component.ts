import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    intervalId!: any;

    projects: {
        identifier: string,
        type: string,
        header: string,
        description: string,
        imgSrc: string,
        url: string
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
            url: 'https://minesweeper-material.onrender.com/'
        },
        {
            identifier: 'rtyqwefbbb',
            type: 'packs',
            header: 'Stream Kafka for NestJS',
            description: 'Stream Kafka for NestJS is a powerful tool that allows developers to easily implement Kafka messaging into their NestJS applications.',
            imgSrc: 'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'https://www.npmjs.com/package/stream-kafka'
        },
        {
            identifier: 'rtyqwefvvv',
            type: 'packs',
            header: 'SocksJS for Angular',
            description: 'Socket.IO inspired wrapper over Stomp Websocket for Angular.',
            imgSrc: 'https://images.unsplash.com/photo-1543966888-7c1dc482a810?q=80&w=906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            url: 'https://www.npmjs.com/package/ngx-socksjs'
        }
    ];

    ngOnInit(): void {
        this.startTimer();

        document.getElementById('next')!.onclick = () => {
            const lists = document.querySelectorAll('.item');
            document.getElementById('slide')!.appendChild(lists[0]);
        };

        document.getElementById('prev')!.onclick = () => {
            const lists = document.querySelectorAll('.item');
            document.getElementById('slide')!.prepend(lists[lists.length - 1]);
        };
    }

    private startTimer(): void {
        this.intervalId = setInterval(() => {
            const lists = document.querySelectorAll('.item');
            document.getElementById('slide')!.appendChild(lists[0]);
        }, 5000);
    }
}
