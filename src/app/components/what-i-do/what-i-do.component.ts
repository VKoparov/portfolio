import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {flyInOut} from "../../animations/fly-in-out";

@Component({
    selector: 'app-what-i-do',
    templateUrl: './what-i-do.component.html',
    styleUrls: ['./what-i-do.component.scss'],
    animations: [flyInOut]
})
export class WhatIDoComponent implements OnInit {

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

    visibility!: boolean;

    ngOnInit(): void {
        this.event.subscribe(location => {
            if (!this.visibility) {
                this.visibility = location === 'app-what-i-do';
            }
        });
    }

    handleActionEvent(fun: Function): void {
        fun.call(this, fun);
    }
}
