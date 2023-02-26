import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailService} from "../../services/email.service";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  socialLinks: { name: string, url: string }[] = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/valentin-koparov-6875b11b9'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/VKoparov'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/valentin.koparov'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/vkoparov'
    },
    {
      name: 'NPM',
      url: 'https://www.npmjs.com/~valik98'
    }
  ];

  contactForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService
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

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.emailService.sendEmail(this.contactForm.value)
    }
  }
}
