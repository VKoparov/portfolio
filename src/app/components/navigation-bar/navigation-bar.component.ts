import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  @Input() windowLocation: string = 'app-about-me';

  @Output() skipLocation = new EventEmitter<string>();

  siteNavigation: string[] = [
    'about-me',
    'what-i-do',
    'tools',
    'projects',
    'reviews',
    'contacts'
  ]

  scrollIntoObject(elementId: string) {
    const element = `app-${elementId}`;
    this.windowLocation = element;
    this.skipLocation.emit(element);
    (document.getElementsByTagName(element)[0] as HTMLElement)
      .scrollIntoView({behavior: 'smooth'});
  }

  formatNavigation(navigation: string): string {
    return navigation.replaceAll('-', ' ')
      .toUpperCase();
  }
}
