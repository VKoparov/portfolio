import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer on init', () => {
    expect(component.intervalId).toBeDefined();
  });

  it('should pause timer when pauseTimer is called', () => {
    expect(component.intervalId).toBeTruthy();
    component.pauseTimer();
    expect(component.intervalId).toBeNull();
  });

  it('should resume timer when resumeTimer is called', () => {
    component.pauseTimer();
    expect(component.intervalId).toBeNull();
    component.resumeTimer();
    expect(component.intervalId).toBeTruthy();
  });

  it('should pause timer on mouseenter and resume on mouseleave on description element', () => {
    const desDebugEl = fixture.debugElement.query(By.css('.des'));
    expect(desDebugEl).toBeTruthy();

    spyOn(component, 'pauseTimer').and.callThrough();
    spyOn(component, 'resumeTimer').and.callThrough();

    desDebugEl.triggerEventHandler('mouseenter', {});
    expect(component.pauseTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeNull();

    desDebugEl.triggerEventHandler('mouseleave', {});
    expect(component.resumeTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();
  });

  it('should pause timer on touchstart and resume on touchend / touchcancel on description element', () => {
    const desDebugEl = fixture.debugElement.query(By.css('.des'));
    expect(desDebugEl).toBeTruthy();

    spyOn(component, 'pauseTimer').and.callThrough();
    spyOn(component, 'resumeTimer').and.callThrough();

    desDebugEl.triggerEventHandler('touchstart', {});
    expect(component.pauseTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeNull();

    desDebugEl.triggerEventHandler('touchend', {});
    expect(component.resumeTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();

    desDebugEl.triggerEventHandler('touchstart', {});
    expect(component.intervalId).toBeNull();

    desDebugEl.triggerEventHandler('touchcancel', {});
    expect(component.resumeTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();
  });

  it('should clear interval on ngOnDestroy', () => {
    expect(component.intervalId).toBeTruthy();
    component.ngOnDestroy();
    expect(component.intervalId).toBeNull();
  });

  it('should have data-lenis-prevent attribute on description element', () => {
    const desEl = fixture.debugElement.query(By.css('.des')).nativeElement;
    expect(desEl.hasAttribute('data-lenis-prevent')).toBeTrue();
  });

  it('should render time indicator on opposite side of controls and reflect progress', () => {
    const timeIndicatorEl = fixture.debugElement.query(By.css('.time-indicator'));
    const timeProgressEl = fixture.debugElement.query(By.css('.time-progress'));
    expect(timeIndicatorEl).toBeTruthy();
    expect(timeProgressEl).toBeTruthy();

    component.progress = 45;
    fixture.detectChanges();
    expect(timeProgressEl.nativeElement.style.width).toBe('45%');
  });

  it('should freeze progress and add paused class when timer is paused', () => {
    component.progress = 30;
    component.pauseTimer();
    fixture.detectChanges();

    expect(component.isPaused).toBeTrue();
    const timeIndicatorEl = fixture.debugElement.query(By.css('.time-indicator'));
    expect(timeIndicatorEl.nativeElement.classList.contains('paused')).toBeTrue();
    expect(component.progress).toBe(30);
  });

  it('should unpause and continue timer when resumeTimer is called', () => {
    component.progress = 30;
    component.pauseTimer();
    expect(component.isPaused).toBeTrue();

    component.resumeTimer();
    expect(component.isPaused).toBeFalse();
    expect(component.intervalId).toBeTruthy();
  });
});
