import {Component, OnInit} from '@angular/core';
import {LenisService} from "./services/lenis.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    title = 'Valentin Koparov';

    constructor(private lenisService: LenisService) {
    }

    ngOnInit(): void {
        this.lenisService.init();
    }
}
