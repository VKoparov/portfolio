import { Component } from '@angular/core';

@Component({
  selector: 'app-social-block',
  templateUrl: './social-block.component.html',
  styleUrls: ['./social-block.component.scss']
})
export class SocialBlockComponent {

  socialLinks: { icon: string, url: string }[] = [
    {
      icon: 'assets/icons/linkedin.svg',
      url: 'https://www.linkedin.com/in/valentin-koparov-6875b11b9'
    },
    {
      icon: 'assets/icons/github.svg',
      url: 'https://github.com/VKoparov'
    },
    {
      icon: 'assets/icons/facebook.svg',
      url: 'https://www.facebook.com/valentin.koparov'
    },
    {
      icon: 'assets/icons/twitter.svg',
      url: 'https://twitter.com/vkoparov'
    },
    {
      icon: 'assets/icons/upwork.svg',
      url: 'https://www.upwork.com/freelancers/~0179fa2d8ab45e83ab'
    },
    {
      icon: 'assets/icons/npm.svg',
      url: 'https://www.npmjs.com/~valik98'
    }
  ];
}
