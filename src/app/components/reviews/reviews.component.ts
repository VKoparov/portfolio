import {AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {SwipeReminder} from "../../shared/swipe-reminder";
import {LenisService} from "../../services/lenis.service";
import {DescriptionScrollController} from "../../shared/description-scroll.controller";

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements AfterViewInit, OnDestroy {

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

  controlsRevealed = false;
  isBackgroundReady = false;
  @ViewChild('revealMarker') private revealMarker!: ElementRef<HTMLElement>;
  @ViewChild('backgroundStage') private backgroundStage!: ElementRef<HTMLElement>;
  @ViewChild('scrollTrack') private scrollTrack!: ElementRef<HTMLElement>;
  private backgroundFrame: number | null = null;
  private lastBackgroundProgress = -1;
  private lastDeckProgress = -1;
  private readonly swipeReminder = new SwipeReminder(-28);
  hintEnabled = false;
  hintPaused = false;
  hintCoolingDown = false;
  private hintCooldownTimer?: ReturnType<typeof setTimeout>;

  private readonly updateBackgroundOnScroll = (): void => {
    if (!this.backgroundStage?.nativeElement) return;
    if (this.backgroundFrame !== null) return;
    this.backgroundFrame = requestAnimationFrame(() => {
      this.backgroundFrame = null;
      const stage = this.backgroundStage.nativeElement;
      const top = stage.getBoundingClientRect().top;
      const progress = Math.max(0, Math.min(1,
        (window.innerHeight - top) / (window.innerHeight * 0.85)));
      if (progress !== this.lastBackgroundProgress) {
        stage.style.setProperty('--smoke-progress', progress.toFixed(4));
        this.lastBackgroundProgress = progress;
      }
      const center = this.revealMarker.nativeElement.getBoundingClientRect().top;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mobile = window.matchMedia('(max-width: 60em)').matches;
      const track = this.scrollTrack.nativeElement;
      const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const rawDeckProgress = mobile && !reducedMotion
        ? -track.getBoundingClientRect().top / travel * 1.2
        : (window.innerHeight * 0.95 - center) / (window.innerHeight * 0.4);
      const deckProgress = reducedMotion ? (rawDeckProgress > 0 ? 1.2 : 0) :
        Math.max(0, Math.min(1.2, rawDeckProgress));
      if (deckProgress !== this.lastDeckProgress) {
        stage.style.setProperty('--deck-progress', deckProgress.toFixed(4));
        stage.style.setProperty('--controls-progress', Math.max(0, Math.min(1, (deckProgress - 1) * 5)).toFixed(4));
        this.lastDeckProgress = deckProgress;
        const controlsVisible = deckProgress > 1;
        if (controlsVisible !== this.controlsRevealed) {
          this.zone.run(() => this.controlsRevealed = controlsVisible);
        }
      }
      const hintEnabled = mobile && !reducedMotion && deckProgress >= 1 &&
        top < window.innerHeight && top + stage.offsetHeight > 0;
      if (hintEnabled !== this.hintEnabled) {
        this.zone.run(() => this.hintEnabled = hintEnabled);
      }
      this.swipeReminder.update(hintEnabled && !this.hintPaused && !this.hintCoolingDown
        ? stage.querySelector<HTMLElement>('.cards .card.active') : null);
    });
  };

  readonly descriptionScroll: DescriptionScrollController;

  constructor(private readonly zone: NgZone, lenis: LenisService) {
    this.descriptionScroll = new DescriptionScrollController(lenis, () => this.controlsRevealed);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.updateBackgroundOnScroll, {passive: true});
      window.addEventListener('resize', this.updateBackgroundOnScroll, {passive: true});
      this.updateBackgroundOnScroll();
    });
  }

  async handleBackgroundLoad(image: HTMLImageElement): Promise<void> {
    try {
      await image.decode();
      this.isBackgroundReady = true;
    } catch {
      // The dark section remains usable if the decorative image fails.
    }
  }

  // Keep the original fan as the fully expanded endpoint.
  reviewSpread = 0;

  updateSpread(event: Event): void {
    this.reviewSpread = Number((event.target as HTMLInputElement).value);
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

  @HostListener('window:pointerup')
  @HostListener('window:pointercancel')
  releaseHintAfterTouch(): void {
    if (!this.dragging && !this.settling) {
      this.hintPaused = false;
      this.pointerId = null;
      this.updateBackgroundOnScroll();
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.lastDeckProgress < 1) return;
    if (!event.isPrimary || event.button !== 0 || this.settling || this.pointerId !== null) return;
    this.hintPaused = true;
    this.swipeReminder.update(null);
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
      this.hintPaused = false;
      this.updateBackgroundOnScroll();
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
    this.hintPaused = false;
    this.updateBackgroundOnScroll();
    if (this.pointerId === null) return;
    this.pointerId = null;
    this.dragging = false;
    this.hintPaused = false;
    this.dragX = 0;
  }

  changeReview(direction: number): void {
    this.hintPaused = false;
    this.hintCoolingDown = true;
    this.swipeReminder.update(null);
    clearTimeout(this.hintCooldownTimer);
    this.hintCooldownTimer = setTimeout(() => {
      this.hintCoolingDown = false;
      this.updateBackgroundOnScroll();
    }, 12000);
    clearTimeout(this.swipeTimer);
    this.pointerId = null;
    this.dragging = false;
    this.settling = false;
    this.dragX = 0;
    this.activeReview = (this.activeReview + direction + this.reviews.length) % this.reviews.length;
  }

  ngOnDestroy(): void {
    this.swipeReminder.destroy();
    clearTimeout(this.hintCooldownTimer);
    this.descriptionScroll.onTouchEnd();
    window.removeEventListener('scroll', this.updateBackgroundOnScroll);
    window.removeEventListener('resize', this.updateBackgroundOnScroll);
    if (this.backgroundFrame !== null) cancelAnimationFrame(this.backgroundFrame);
    clearTimeout(this.swipeTimer);
  }

  getCardAngle(index: number): string {
    const depth = (index - this.activeReview + this.reviews.length) % this.reviews.length;
    const angles = [0, -3, 4, -5.5, 6, -7];
    return `${angles[depth % angles.length]}deg`;
  }
}
