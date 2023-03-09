import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxLandingComponent } from './parallax-landing.component';

describe('ParallaxLandingComponent', () => {
  let component: ParallaxLandingComponent;
  let fixture: ComponentFixture<ParallaxLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParallaxLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParallaxLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
