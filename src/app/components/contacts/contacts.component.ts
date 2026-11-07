import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../../services/email.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, AfterViewInit, OnDestroy {

  contactForm!: FormGroup;
  @ViewChild('contactLinks') private contactLinks!: ElementRef<HTMLElement>;
  @ViewChild('portrait') private portrait!: ElementRef<HTMLImageElement>;
  private scrollFrame = 0;

  private readonly updateScroll = (): void => {
    if (this.scrollFrame) return;
    this.scrollFrame = requestAnimationFrame(() => {
      this.scrollFrame = 0;
      const viewportHeight = window.innerHeight;
      const image = this.portrait.nativeElement;
      const links = this.contactLinks.nativeElement;
      const imageBounds = image.getBoundingClientRect();
      const linksTop = links.getBoundingClientRect().top;
      const progress = (top: number, start: number, distance: number): number =>
        Math.max(0, Math.min(1, (viewportHeight * start - top) / (viewportHeight * distance)));

      // Reveal linearly over the entire portrait, ending when its bottom
      // reaches the viewport bottom. No easing or timed catch-up on reversal.
      const imageProgress = (viewportHeight - imageBounds.top) / Math.max(1, imageBounds.height);
      image.style.opacity = String(Math.max(0, Math.min(1, imageProgress)));
      links.querySelectorAll<HTMLElement>('.contact').forEach((link, index) => {
        const reveal = progress(linksTop + index * 24, 0.96, 0.2);
        link.style.opacity = String(reveal);
        link.style.transform = `translateY(${(1 - reveal) * 24}px)`;
      });
    });
  };

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private zone: NgZone
  ) {
  }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      _subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.updateScroll, {passive: true});
      window.addEventListener('resize', this.updateScroll);
      this.portrait.nativeElement.addEventListener('load', this.updateScroll);
      this.updateScroll();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.updateScroll);
    window.removeEventListener('resize', this.updateScroll);
    this.portrait.nativeElement.removeEventListener('load', this.updateScroll);
    cancelAnimationFrame(this.scrollFrame);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.emailService.sendEmail(this.contactForm.value)
    }
  }
}
