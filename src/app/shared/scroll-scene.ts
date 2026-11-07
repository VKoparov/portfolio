/** Run scroll work only near the viewport, with a final update on exit.
 * Create this outside Angular so scroll frames do not trigger global checks.
 */
export function observeScrollScene(
  element: HTMLElement,
  update: () => void,
  resize: () => void = update
): () => void {
  let nearby = false;
  const refresh = () => {
    window.removeEventListener('scroll', update);
    if (nearby && !document.hidden) {
      window.addEventListener('scroll', update, {passive: true});
    }
    if (!document.hidden) update();
  };
  const observer = new IntersectionObserver(entries => {
    const next = entries[0].isIntersecting;
    if (next !== nearby) {
      nearby = next;
      refresh();
    }
  }, {rootMargin: '100% 0px'});
  observer.observe(element);
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('resize', resize, {passive: true});
  resize();
  return () => {
    observer.disconnect();
    window.removeEventListener('scroll', update);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', refresh);
  };
}
