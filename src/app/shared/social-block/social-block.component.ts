import { Component } from '@angular/core';

@Component({
  selector: 'app-social-block',
  templateUrl: './social-block.component.html',
  styleUrls: ['./social-block.component.scss']
})
export class SocialBlockComponent {

  socialLinks: { name: string, icon: string, url: string }[] = [
    {
      name: 'LinkedIn',
      icon: 'assets/icons/linkedin.svg',
      url: 'https://www.linkedin.com/in/valentin-koparov-6875b11b9'
    },
    {
      name: 'GitHub',
      icon: 'assets/icons/github.svg',
      url: 'https://github.com/VKoparov'
    },
    {
      name: 'Facebook',
      icon: 'assets/icons/facebook.svg',
      url: 'https://www.facebook.com/valentin.koparov'
    },
    {
      name: 'Upwork',
      icon: 'assets/icons/upwork.svg',
      url: 'https://www.upwork.com/freelancers/~0179fa2d8ab45e83ab'
    },
    {
      name: 'npm',
      icon: 'assets/icons/npm.svg',
      url: 'https://www.npmjs.com/~valik98'
    }
  ];
}
