import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {fade} from "../../animations/fade";

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
    animations: [fade]
})
export class NavigationBarComponent implements OnInit {

    @Input() event!: Observable<string>;

    currentLocation!: string;

    isLogoVisible: boolean = false;

    isNavigationOpen: boolean = false;

    readonly siteNavigation: string[] = [
        'app-homepage',
        'app-what-i-do',
        'app-about-me',
        'app-reviews',
        'app-projects',
        'app-contacts'
    ];

    private readonly homepage: string = 'app-homepage';

    ngOnInit(): void {
        this.event.subscribe(location => {
            this.currentLocation = location;
            this.isLogoVisible = location !== this.homepage;
        });
    }

    handleNavigationOpenEvent() {
        this.isNavigationOpen = !this.isNavigationOpen;
        this.isLogoVisible = this.currentLocation !== this.homepage || this.isNavigationOpen;
        this.handleMainScrollBehavior();
    }

    scrollIntoPage(elementId: string) {
        const element = `${elementId.toLowerCase()}`;

        this.isNavigationOpen = !this.isNavigationOpen;
        this.handleMainScrollBehavior();

        (document.getElementsByTagName(element)[0] as HTMLElement)
            .scrollIntoView({behavior: 'smooth'});
    }

    formatNavigation(navigation: string): string {
        navigation = navigation
            .replace('app-', '')
            .replaceAll('-', ' ');
        return navigation[0].toUpperCase() + navigation.substring(1).toLowerCase();
    }

    private handleMainScrollBehavior() {
        document.body.style.overflow = this.isNavigationOpen ? 'hidden' : '';
    }
}
