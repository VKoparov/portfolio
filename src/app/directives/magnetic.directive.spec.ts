import { MagneticDirective } from './magnetic.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('MagneticDirective', () => {
  it('should create an instance', () => {
    const elMock = new ElementRef(document.createElement('div'));
    const rendererMock = jasmine.createSpyObj('Renderer2', ['setStyle', 'listen']);
    const directive = new MagneticDirective(elMock, rendererMock);
    expect(directive).toBeTruthy();
  });
});
