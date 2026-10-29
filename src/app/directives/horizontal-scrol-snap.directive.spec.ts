import { HorizontalScrollSnapDirective } from './horizontal-scroll-snap.directive';
import { ElementRef } from '@angular/core';

describe('HorizontalScrolSnapDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('div'));
    const directive = new HorizontalScrollSnapDirective(elMock);
    expect(directive).toBeTruthy();
  });
});
