import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Observable} from "rxjs";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {

  reviews: { imgSrc: string, description: string, name: string, jobTitle: string }[] = [
    {
      imgSrc: 'assets/profiles/1537978101577.jpeg',
      description: '"It\'s rare to come across to a positive and passionate developer like Valentin. I had the pleasure of working with Valentin for almost an year on a project for Yotpo. He showed outstanding growth as Java and Angular professional. Valentin is a team player and is always committed to the team\'s success. He switches fast between various technologies and tasks and is the kind of person that will not rest until the task is completed. Valentin will be a valuable asset to any team."',
      name: 'Georgi Dimov',
      jobTitle: 'Scrum Master at KPMG'
    },
    {
      imgSrc: 'assets/profiles/1854447566058.jpeg',
      description: 'I have worked with Valentin on several occasions throughout 2022 and 2023, with him being a software trainer/teacher on a training program developed by STY. Valentin has managed several iterations of the program mostly independently and has received excellent feedback. The program focused on Java, OOP, code quality, rdbms (mysql), html/css/js, typescript, angular.\n' +
          '\n' +
          'I was happy to work with Valentin, he\'s acted professionally, proactively and took ownership of the training programs.\n' +
          '\n' +
          'I highly recommend him.',
      name: 'Mihail Stoynov',
      jobTitle: 'OWASP Chapter Leader (Sofia) at OWASP'
    },
    {
      imgSrc: 'assets/profiles/1554447566058.jpeg',
      description: '"I worked with Valentine for about 10 months, working together on developing a new product in Yotpo. Valentine is passionate to succeed, to learn & solve problems, and is always seeking how to improve his craftsmanship. He is positive and a great team member, always looking for helping others. Valentine learned the entire stack from scratch, really fast, and was able to produce high quality outputs which helped us reach our goals. It was a pleasure seeing Valentine grow & succeed the way he did."',
      name: 'Eyal Kenig',
      jobTitle: 'R&D Director at Yotpo'
    },
    {
      imgSrc: 'assets/profiles/1517754782980.jpeg',
      description: '"I worked with Valentin on a new project for almost an year in 2021 and we jointly delivered as per the requirements and on time. Valentin is energetic, enthusiastic, and passionate full stack software developer. He is always willing to learn new technologies and to improve his skills. He is able to fully implement the planned work regardless of if they involve developing on the front-end or on the back-end. Most of all Valentin is a valuable team player and is always willing to share his experience with his team-mates. I recommend Valentin for positions that require software development and or teaching."',
      name: 'Kamen Tomov',
      jobTitle: 'Software Engineer'
    },
    {
      imgSrc: 'assets/profiles/1884447566058.jpeg',
      description: '"Experienced software developer with expertise in Java, microservices, and Angular. Strong team player with excellent communication skills. Proven experience in designing, developing, and implementing scalable and secure software solutions."',
      name: 'Nikolay Ivanov',
      jobTitle: 'Senior Full Stack Software Developer at UKG'
    },
    {
      imgSrc: 'assets/profiles/1994447566058.jpeg',
      description: '"Valentin possesses a wide variety of skills that make him an asset to every team he is a part of. His problem-solving abilities are enhanced by his dedication and innovative approach to his work. Valentin is not only technically proficient but also a great team player, always ready to assist colleagues and share knowledge. It was a pleasure working with him."',
      name: 'Krasimir Dimitrov',
      jobTitle: 'Software Developer'
    }
  ];

  @Input() event!: Observable<string>;

  objectScale: string = 'scale(.0)';

  ngOnInit(): void {
    this.event.subscribe(location => {
      if (location === 'app-reviews') {
        setTimeout(() => {
          this.objectScale = 'scale(1)';
        }, 300);
      }
    });
  }

  activeReview = 0;
  dragX = 0;
  dragging = false;
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private startTime = 0;
  private settling = false;
  private swipeTimer?: ReturnType<typeof setTimeout>;

  onPointerDown(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0 || this.settling || this.pointerId !== null) return;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startTime = event.timeStamp;
  }

  onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    if (!this.dragging) {
      if (Math.max(Math.abs(x), Math.abs(y)) < 8) return;
      if (Math.abs(y) >= Math.abs(x)) {
        this.cancelSwipe();
        return;
      }
      this.dragging = true;
      (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    }
    this.dragX = x;
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    const distance = this.dragX;
    const elapsed = Math.max(event.timeStamp - this.startTime, 1);
    const commit = this.dragging && (Math.abs(distance) >= 65 ||
      (Math.abs(distance) >= 25 && Math.abs(distance) / elapsed > 0.45));
    this.pointerId = null;
    this.dragging = false;
    if (!commit) {
      this.dragX = 0;
      return;
    }
    this.settling = true;
    this.dragX = Math.sign(distance) * 480;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.swipeTimer = setTimeout(() => {
      this.changeReview(distance < 0 ? 1 : -1);
      this.settling = false;
    }, reducedMotion ? 0 : 180);
  }

  onLostPointerCapture(event: PointerEvent): void {
    // Touch starts with implicit capture on the touched child. Moving capture
    // to the deck emits a bubbling loss event from that child, not a cancelled swipe.
    if (event.target === event.currentTarget && event.pointerId === this.pointerId) {
      this.cancelSwipe();
    }
  }

  cancelSwipe(): void {
    if (this.pointerId === null) return;
    this.pointerId = null;
    this.dragging = false;
    this.dragX = 0;
  }

  changeReview(direction: number): void {
    clearTimeout(this.swipeTimer);
    this.pointerId = null;
    this.dragging = false;
    this.settling = false;
    this.dragX = 0;
    this.activeReview = (this.activeReview + direction + this.reviews.length) % this.reviews.length;
  }

  ngOnDestroy(): void {
    clearTimeout(this.swipeTimer);
  }

  getCardAngle(index: number): string {
    const angles = [4, -8, -7, 11, 13, -17];
    return `${angles[index % angles.length]}deg`;
  }
}
