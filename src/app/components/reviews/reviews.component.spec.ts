import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsComponent } from './reviews.component';

describe('ReviewsComponent', () => {
  let component: ReviewsComponent;
  let fixture: ComponentFixture<ReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// These gesture tests do not need the component's entrance-animation input.
describe('ReviewsComponent pointer capture', () => {
  function startDrag(component: ReviewsComponent): void {
    component.onPointerDown({isPrimary: true, button: 0, pointerId: 1,
      clientX: 100, clientY: 100, timeStamp: 0} as PointerEvent);
    component.onPointerMove({pointerId: 1, clientX: 20, clientY: 100,
      currentTarget: {setPointerCapture: () => {}}} as unknown as PointerEvent);
  }

  it('keeps dragging when a touched child hands capture to the deck', () => {
    const component = new ReviewsComponent();
    startDrag(component);
    component.onLostPointerCapture({pointerId: 1, target: {}, currentTarget: {}} as unknown as PointerEvent);
    expect(component.dragging).toBeTrue();
    expect(component.dragX).toBe(-80);
  });

  it('resets the drag when the deck itself loses capture', () => {
    const component = new ReviewsComponent();
    const deck = document.createElement('div');
    startDrag(component);
    component.onLostPointerCapture({pointerId: 1, target: deck, currentTarget: deck} as unknown as PointerEvent);
    expect(component.dragging).toBeFalse();
    expect(component.dragX).toBe(0);
  });
});
