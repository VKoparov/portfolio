import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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

    desDebugEl.triggerEventHandler('touchstart', {touches: []});
    expect(component.pauseTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeNull();

    desDebugEl.triggerEventHandler('touchend', {});
    expect(component.resumeTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();

    desDebugEl.triggerEventHandler('touchstart', {touches: []});
    expect(component.intervalId).toBeNull();

    desDebugEl.triggerEventHandler('touchcancel', {});
    expect(component.resumeTimer).toHaveBeenCalled();
    expect(component.intervalId).toBeTruthy();
  });

  it('should update progress and cycle the active project after five seconds', fakeAsync(() => {
    component.startTimer();
    tick(2500);
    expect(component.progress).toBe(50);
    const progress = fixture.nativeElement.querySelector('.time-progress') as HTMLElement;
    expect(progress.style.transform).toBe('scaleX(0.5)');
    tick(2500);
    expect(component.activeProject).toBe(component.projects[2]);
    expect(component.progress).toBe(0);
    component.pauseTimer();
  }));

  it('should clear interval on ngOnDestroy', () => {
    expect(component.intervalId).toBeTruthy();
    component.ngOnDestroy();
    expect(component.intervalId).toBeNull();
  });

  it('should delegate description wheel gestures to the shared scroll controller', () => {
    const wheel = new WheelEvent('wheel', {deltaY: 30});
    const handler = spyOn(component.descriptionScroll, 'onWheel');
    fixture.debugElement.query(By.css('.des')).triggerEventHandler('wheel', wheel);
    expect(handler).toHaveBeenCalledWith(wheel);
  });

  it('should render time indicator on opposite side of controls and reflect progress', () => {
    const timeIndicatorEl = fixture.debugElement.query(By.css('.time-indicator'));
    const timeProgressEl = fixture.debugElement.query(By.css('.time-progress'));
    expect(timeIndicatorEl).toBeTruthy();
    expect(timeProgressEl).toBeTruthy();

    component.progress = 45;
    fixture.detectChanges();
    expect(timeProgressEl.nativeElement.style.transform).toBe('scaleX(0.45)');
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
