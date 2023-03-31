import { Component } from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent {

  location!: string;

  visibilitySubject: Subject<string> = new Subject<string>();

  visibilityChangeHandler(event: string, windowLocation: string) {
    if (event === 'VISIBLE') {
      this.visibilitySubject.next(windowLocation);
      this.location = windowLocation;
      return;
    }
  }
}
