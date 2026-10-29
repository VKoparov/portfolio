import { EnterTheViewportNotifierDirective } from './enter-the-viewport-notifier.directive';
import { ElementRef } from '@angular/core';

describe('EnterTheViewportNotifierDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('div'));
    const directive = new EnterTheViewportNotifierDirective(elMock);
    expect(directive).toBeTruthy();
  });
});
