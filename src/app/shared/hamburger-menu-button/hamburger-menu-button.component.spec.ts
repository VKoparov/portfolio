import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerMenuButtonComponent } from './hamburger-menu-button.component';

describe('HamburgerMenuButtonComponent', () => {
  let component: HamburgerMenuButtonComponent;
  let fixture: ComponentFixture<HamburgerMenuButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HamburgerMenuButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HamburgerMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
