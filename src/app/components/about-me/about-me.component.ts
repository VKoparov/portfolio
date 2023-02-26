import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent {
  introduction: string = 'I’m Valentin, a responsible and committed software developer, with a get-it-done and on-time spirit. Implementing, testing and delivering complex web applications using variety of programming languages and technologies!';
}
