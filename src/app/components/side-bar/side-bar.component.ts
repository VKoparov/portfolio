import {Component, ElementRef, HostListener} from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: 'side-bar.component.html',
  styleUrls: ['side-bar.component.scss']
})
export class SideBarComponent {

  isHidden = true;

  siteNavigation: string[] = [
    'about-me',
    'what-i-do',
    'tools',
    'projects',
    'reviews',
    'contacts'
  ]

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isHidden = true;
    }
  }

  scrollIntoObject(elementId: string) {
    const element = `app-${elementId}`;
    this.isHidden = true;
    (document.getElementsByTagName(element)[0] as HTMLElement)
      .scrollIntoView({behavior: 'smooth'});
  }

  formatNavigation(navigation: string): string {
    return navigation.replaceAll('-', ' ')
      .toUpperCase();
  }

  toggleSidebar() {
    this.isHidden = !this.isHidden;
  }
}
