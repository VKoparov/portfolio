import { Component } from '@angular/core';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss']
})
export class FrameComponent {

  location!: string;

  skipLocation!: string;

  visibilityChangeHandler(event: string, windowLocation: string) {
    if (this.skipLocation && this.skipLocation !== windowLocation) {
      return;
    }
    if (event === 'VISIBLE') {
      this.location = windowLocation;
      this.skipLocation = '';
      return;
    }
  }

  handleSkipLocation(location: string) {
    this.skipLocation = location;
  }
}
