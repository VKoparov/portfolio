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
  contactsRevealed = false;
  @ViewChild('contactLinks') private contactLinks!: ElementRef<HTMLElement>;
  private revealObserver?: IntersectionObserver;

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
    this.revealObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.intersectionRatio >= 0.75)) {
        this.zone.run(() => this.contactsRevealed = true);
        this.revealObserver?.disconnect();
      }
    }, {threshold: 0.75, rootMargin: '0px 0px -40px 0px'});
    this.revealObserver.observe(this.contactLinks.nativeElement);
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.emailService.sendEmail(this.contactForm.value)
    }
  }
}
