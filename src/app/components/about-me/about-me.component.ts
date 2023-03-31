import {Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {

  @Input() event!: Observable<string>;

  objectRotate: string = 'rotate(0)';

  ngOnInit(): void {
    this.event.subscribe(location => {
      if (location === 'app-about-me') {
        setTimeout(() => {
          this.objectRotate = 'rotate(115deg)';
        }, 500);
      }
    });
  }
}
