/** Own the reminder separately from the card's drag and resize transforms. */
export class SwipeReminder {
  private target: HTMLElement | null = null;
  private animation?: Animation;

  constructor(private readonly distance: number) {}

  update(target: HTMLElement | null): void {
    if (target === this.target && this.animation?.playState === 'running') return;
    // Automatic carousel changes transfer the running loop to the new thumbnail.
    // A deliberate pause (null target) still resets it for the swipe cooldown.
    const phase = target && this.target ? this.animation?.currentTime ?? null : null;
    this.animation?.cancel();
    this.animation = undefined;
    this.target = target;
    if (!target) return;
    this.animation = target.animate([
      {translate: '0px 0px', offset: 0},
      {translate: `${this.distance}px 0px`, offset: 0.28},
      {translate: `${-Math.sign(this.distance) * 2}px 0px`, offset: 0.46},
      {translate: '0px 0px', offset: 0.6},
      {translate: '0px 0px', offset: 1}
    ], {duration: 2000, delay: 250, iterations: Infinity, easing: 'ease-in-out'});
    if (phase !== null) this.animation.currentTime = phase;
  }

  destroy(): void { this.update(null); }
}
