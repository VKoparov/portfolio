import {AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements AfterViewInit, OnDestroy {
  @Input() event!: Observable<string>;
  @ViewChild('scrollTrack') private track!: ElementRef<HTMLElement>;
  @ViewChild('stage') private stage!: ElementRef<HTMLElement>;
  @ViewChild('text') private text!: ElementRef<HTMLElement>;

  private frame: number | null = null;
  private resizeObserver?: ResizeObserver;
  private needsMeasure = true;
  private canPin = false;
  private pinTop = 0;
  private travel = 1;
  private readonly motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  constructor(private readonly zone: NgZone) {}

  private readonly schedule = (): void => {
    if (this.frame !== null) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = null;
      const track = this.track.nativeElement;
      const stage = this.stage.nativeElement;
      const blocks = Array.from(this.text.nativeElement.querySelectorAll<HTMLElement>('.text-block'));
      const viewport = window.innerHeight;
      if (this.needsMeasure) {
        const first = blocks[0].getBoundingClientRect();
        const last = blocks[blocks.length - 1].getBoundingClientRect();
        const stageTop = stage.getBoundingClientRect().top;
        // Never pull the bottom of the original section above the viewport.
        const minimumTop = Math.min(0, viewport - stage.offsetHeight);
        const mobile = window.matchMedia('(max-width: 60em)').matches;
        const resume = this.text.nativeElement.querySelector<HTMLElement>('.download-cv');
        // On mobile preserve the portrait and resume composition, rather than scrolling
        // past them to align the paragraphs with the top of the viewport.
        const anchorTop = mobile && resume ? resume.getBoundingClientRect().top : first.top;
        const anchorTarget = mobile ? Math.max(96, Math.min(140, viewport * 0.15)) : 96;
        this.pinTop = Math.max(minimumTop, Math.min(0, anchorTarget - (anchorTop - stageTop)));
        const firstPinnedTop = first.top - stageTop + this.pinTop;
        const lastPinnedBottom = last.bottom - stageTop + this.pinTop;
        this.canPin = !this.motionPreference.matches && firstPinnedTop >= 80 &&
          lastPinnedBottom <= (mobile ? viewport * 1.12 : viewport - 24);
        this.travel = viewport * 1.4;
        track.classList.toggle('pinned-enabled', this.canPin);
        track.style.setProperty('--pin-top', `${this.pinTop}px`);
        track.style.height = this.canPin ? `${stage.offsetHeight + this.travel + viewport * 0.1}px` : 'auto';
        this.needsMeasure = false;
      }
      const progress = Math.max(0, Math.min(1, (this.pinTop - track.getBoundingClientRect().top) / this.travel));
      const rotationProgress = this.canPin ? progress : Math.max(0, Math.min(1,
        (viewport - track.getBoundingClientRect().top) / (viewport + stage.offsetHeight)));
      track.style.setProperty('--resume-angle', `${this.motionPreference.matches ? 0 : rotationProgress * 360}deg`);
      blocks.forEach((block, index) => {
        const reveal = this.motionPreference.matches ? 1 : this.canPin
          ? Math.max(0, Math.min(1, progress * blocks.length - index))
          : Math.max(0, Math.min(1, (viewport * 0.85 - block.getBoundingClientRect().top) / (viewport * 0.3)));
        block.style.setProperty('--reveal', reveal.toFixed(4));
      });
    });
  };

  private readonly measure = (): void => {
    this.needsMeasure = true;
    this.schedule();
  };

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(this.measure);
      this.resizeObserver.observe(this.text.nativeElement);
      this.resizeObserver.observe(this.stage.nativeElement);
      window.addEventListener('scroll', this.schedule, {passive: true});
      window.addEventListener('resize', this.measure, {passive: true});
      this.motionPreference.addEventListener('change', this.measure);
      this.schedule();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.schedule);
    window.removeEventListener('resize', this.measure);
    this.motionPreference.removeEventListener('change', this.measure);
    this.resizeObserver?.disconnect();
    if (this.frame !== null) cancelAnimationFrame(this.frame);
  }
}
