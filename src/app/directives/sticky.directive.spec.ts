import { StickyDirective } from './sticky.directive';
import { ElementRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

describe('StickyDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('div'));
    const rendererMock = jasmine.createSpyObj('Renderer2', ['setAttribute']);
    const destroyMock = new Subject<void>();
    const directive = new StickyDirective(destroyMock, window, rendererMock, elMock);
    expect(directive).toBeTruthy();
  });
});
