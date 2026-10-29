import { HorizontalScrollDirective } from './horizontal-scroll.directive';
import { ElementRef } from '@angular/core';

describe('HorizontalScrollDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('div'));
    const directive = new HorizontalScrollDirective(elMock);
    expect(directive).toBeTruthy();
  });
});
