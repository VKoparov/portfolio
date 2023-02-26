import { Component } from '@angular/core';

@Component({
  selector: 'app-what-i-do',
  templateUrl: './what-i-do.component.html',
  styleUrls: ['./what-i-do.component.scss']
})
export class WhatIDoComponent {

  templates: { imgSrc: string, header: string, description: string }[] = [
    {
      imgSrc: 'assets/vectors/web-apps.svg',
      header: 'Web Applications',
      description: 'As a web developer, my expertise lies in creating and maintaining web applications and websites. With a deep understanding of programming languages such as HTML, CSS, TypeScript, and Java, I am able to design and develop websites that are not only aesthetically pleasing but also functional and user-friendly.'
    },
    {
      imgSrc: 'assets/vectors/apis.svg',
      header: 'APIs',
      description: 'My expertise in web APIs allows me to create powerful and efficient interfaces that simplify complex processes and automate tasks, resulting in improved productivity and enhanced user experiences. I have a deep understanding of the various API protocols such as REST, SOAP, and GraphQL, which allows me to choose the most appropriate API protocol for each project based on its specific requirements.'
    },
    {
      imgSrc: 'assets/vectors/packages.svg',
      header: 'Web Packages',
      description: 'My knowledge of npm allows me to quickly and easily create, install and manage packages and dependencies, ensuring that web applications are built with the latest and most reliable packages available. I have a deep understanding of the npm ecosystem and its vast collection of packages, which enables me to select the best packages for each project based on its specific requirements.'
    },
    {
      imgSrc: 'assets/vectors/coaching.svg',
      header: 'Coaching',
      description: 'My coaching approach involves creating a supportive and collaborative learning environment that enables interns to ask questions, experiment with new technologies, and learn from their mistakes. I take a personalized approach to coaching, tailoring my teaching style to each intern\'s learning style and pace.'
    }
  ];
}
