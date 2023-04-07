import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-hamburger-menu-button',
  templateUrl: './hamburger-menu-button.component.html',
  styleUrls: ['./hamburger-menu-button.component.scss']
})
export class HamburgerMenuButtonComponent implements OnInit {

  @ViewChild('ham') menu!: ElementRef;

  @Input() menuItemClickEvent!: Observable<void>;

  ngOnInit(): void {
    this.menuItemClickEvent.subscribe(() => this.handleClickEvent());
  }

  handleClickEvent() {
    this.menu.nativeElement.classList.toggle('active');
  }
}
