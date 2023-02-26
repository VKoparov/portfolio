import {Component} from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent {

  tools: { imgSrc: string, name: string }[] = [
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      name: 'Java'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg',
      name: 'Kotlin'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
      name: 'Spring'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      name: 'TypeScript'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      name: 'Angular'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
      name: 'VueJS'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      name: 'HTML'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      name: 'CSS/SCSS'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      name: 'Docker'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      name: 'Kubernetes'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-plain.svg',
      name: 'Heroku'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-plain.svg',
      name: 'TravisCI'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gradle/gradle-plain.svg',
      name: 'Gradle'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
      name: 'NPM'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg',
      name: 'Kafka'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      name: 'MongoDB'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
      name: 'MySQL'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
      name: 'Redis'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      name: 'PostgreSQL'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg',
      name: 'Grafana'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg',
      name: 'SocketIO'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/trello/trello-plain.svg',
      name: 'Trello'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      name: 'Git'
    },
    {
      imgSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetbrains/jetbrains-original.svg',
      name: 'JetBrains'
    }
  ];
}
