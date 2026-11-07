import {observeScrollScene} from './scroll-scene';

describe('scroll scene activity', () => {
  let notify: (visible: boolean) => void;
  let disconnect: jasmine.Spy;
  let cleanup: () => void;

  beforeEach(() => {
    disconnect = jasmine.createSpy('disconnect');
    spyOn(window, 'IntersectionObserver').and.callFake(function(callback: IntersectionObserverCallback) {
      const observer = {observe: () => {}, disconnect} as unknown as IntersectionObserver;
      notify = visible => callback([{isIntersecting: visible} as IntersectionObserverEntry], observer);
      return observer;
    });
    spyOnProperty(document, 'hidden', 'get').and.returnValue(false);
  });

  afterEach(() => cleanup?.());

  it('stops scroll work offscreen and refreshes both exit and re-entry', () => {
    const update = jasmine.createSpy('update');
    cleanup = observeScrollScene(document.createElement('div'), update);
    update.calls.reset();
    window.dispatchEvent(new Event('scroll'));
    expect(update).not.toHaveBeenCalled();

    notify(true);
    window.dispatchEvent(new Event('scroll'));
    expect(update).toHaveBeenCalledTimes(2);

    notify(false);
    expect(update).toHaveBeenCalledTimes(3);
    window.dispatchEvent(new Event('scroll'));
    expect(update).toHaveBeenCalledTimes(3);

    notify(true);
    expect(update).toHaveBeenCalledTimes(4);
  });

  it('keeps layout measurements responsive offscreen and cleans up listeners', () => {
    const update = jasmine.createSpy('update');
    const resize = jasmine.createSpy('resize');
    cleanup = observeScrollScene(document.createElement('div'), update, resize);
    window.dispatchEvent(new Event('resize'));
    expect(resize).toHaveBeenCalledTimes(2);
    notify(true);
    cleanup();
    update.calls.reset();
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('resize'));
    expect(update).not.toHaveBeenCalled();
    expect(resize).toHaveBeenCalledTimes(2);
    expect(disconnect).toHaveBeenCalled();
  });
});
