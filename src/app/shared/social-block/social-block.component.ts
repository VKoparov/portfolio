import {AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild} from '@angular/core';

@Component({
  selector: 'app-social-block',
  templateUrl: './social-block.component.html',
  styleUrls: ['./social-block.component.scss']
})
export class SocialBlockComponent implements AfterViewInit, OnDestroy {
  @ViewChild('socialTab', {static: true}) private socialTab!: ElementRef<HTMLElement>;
  @ViewChild('linksContainer', {static: true}) private linksContainer!: ElementRef<HTMLElement>;
  @ViewChild('waveSvg', {static: true}) private waveSvg!: ElementRef<SVGSVGElement>;
  @ViewChild('wavePath', {static: true}) private wavePath!: ElementRef<SVGPathElement>;
  @ViewChild('waveGroup', {static: true}) private waveGroup!: ElementRef<SVGGElement>;
  @ViewChild('waveArrow', {static: true}) private waveArrow!: ElementRef<SVGGElement>;
  private dockProgress = 0;
  private dockFrame = 0;
  private wantsCorner = false;
  private dockTarget = false;
  private dockScrollStart = 0;
  fastDocking = false;
  private dockTimer?: ReturnType<typeof setTimeout>;
  @Input() set cornerDocked(value: boolean) {
    this.wantsCorner = value;
    if (this.mobile) this.syncDock();
  }
  constructor(private readonly zone: NgZone) {}

  avoidingContent = false;
  private collisionFrame = 0;
  pastHero = false;
  expanded = false;
  private mobile?: MediaQueryList;
  private readonly onScroll = () => {
    if (this.mobile?.matches && this.dockTarget && !this.fastDocking && this.dockProgress < 1 &&
        Math.abs(window.scrollY - this.dockScrollStart) > window.innerHeight * 0.35) {
      this.fastDocking = true;
      clearTimeout(this.dockTimer);
      cancelAnimationFrame(this.dockFrame);
      this.dockFrame = 0;
      // Finish absorbing the icons first, then take the shorter trip.
      this.dockTimer = setTimeout(() => this.moveWave(1), 120);
    }
    if (this.mobile?.matches && this.pastHero && this.expanded) {
      this.expanded = false;
    }
    this.scheduleOverlapCheck();
  };
  private readonly onViewportChange = () => {
    this.expanded = false;
    this.syncDock();
    this.renderWave();
    this.scheduleOverlapCheck();
  };

  get collapsed(): boolean {
    return !!this.mobile?.matches && this.pastHero && !this.expanded;
  }

  ngAfterViewInit(): void {
    this.mobile = window.matchMedia('(max-width: 60em)');
    this.mobile.addEventListener('change', this.onViewportChange);
    window.addEventListener('resize', this.onViewportChange);
    window.addEventListener('scroll', this.onScroll, {passive: true, capture: true});
    this.syncDock();
    this.renderWave();
  }

  private syncDock(): void {
    const target = !!this.mobile?.matches && this.wantsCorner;
    if (target === this.dockTarget) return;
    this.dockTarget = target;
    this.dockScrollStart = window.scrollY;
    this.fastDocking = false;
    this.expanded = false;
    this.avoidingContent = false;
    clearTimeout(this.dockTimer);
    cancelAnimationFrame(this.dockFrame);
    this.dockFrame = 0;
    if (target) {
      // Let the staggered icons finish entering the side pool before transport.
      this.pastHero = true;
      const hero = document.querySelector('.frame-container app-homepage .homepage-container');
      this.fastDocking = !!hero && hero.getBoundingClientRect().bottom < -window.innerHeight * 0.35;
      const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 :
        (this.fastDocking ? 120 : 1050);
      this.dockTimer = setTimeout(() => this.moveWave(1), delay);
    } else {
      // Return the pool to the side before releasing its icons.
      this.moveWave(0, () => {
        if (!this.dockTarget) this.pastHero = false;
      });
    }
  }

  private moveWave(target: number, complete?: () => void): void {
    cancelAnimationFrame(this.dockFrame);
    const start = this.dockProgress;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : (this.fastDocking ? 220 : 550) * Math.abs(target - start);
    const started = performance.now();
    this.zone.runOutsideAngular(() => {
      const frame = (time: number) => {
        const t = duration ? Math.min(1, (time - started) / duration) : 1;
        const eased = t*t*t*(t*(t*6-15)+10);
        this.dockProgress = start + (target-start)*eased;
        this.renderWave();
        if (t < 1) this.dockFrame = requestAnimationFrame(frame);
        else {
          this.dockFrame = 0;
          this.zone.run(() => { complete?.(); this.scheduleOverlapCheck(); });
        }
      };
      this.dockFrame = requestAnimationFrame(frame);
    });
  }

  private renderWave(): void {
    if (!this.waveSvg) return;
    if (!this.mobile?.matches) {
      this.linksContainer.nativeElement.style.removeProperty('transform');
      this.socialTab.nativeElement.parentElement!.classList.remove('wave-at-corner');
      return;
    }
    const h = window.innerHeight, p = this.dockProgress;
    const anchor = this.socialTab.nativeElement.parentElement!;
    const cy = anchor.getBoundingClientRect().top + anchor.offsetHeight / 2;
    const travel = Math.min(1, p/0.8);
    const q = Math.max(0, (p-0.8)/0.2);
    const spread = q*q*(3-2*q);
    const side = [120,cy-60,120,cy-36,106,cy-32,96,cy-29,79,cy-26,75,cy-15,75,cy,
      75,cy+15,79,cy+26,96,cy+29,106,cy+32,120,cy+36,120,cy+60];
    const corner = [120,100,120,72,112,65,96,61,74,57,66,44,62,28,
      58,10,36,0,14,0,52,0,86,0,120,0];
    const size = 0.82;
    const v = side.map((value,index) => {
      const fromOrigin = index % 2 ? cy : 120;
      const toOrigin = index % 2 ? 0 : 120;
      const from = fromOrigin + (value - fromOrigin) * size;
      const to = toOrigin + (corner[index] - toOrigin) * size;
      return from + (to - from) * (index % 2 ? travel : spread);
    });
    this.waveSvg.nativeElement.setAttribute('viewBox', `0 0 120 ${h}`);
    this.wavePath.nativeElement.setAttribute('d', `M${v[0]} ${v[1]} `+[2,8,14,20].map(i=>`C${v.slice(i,i+6).join(' ')}`).join(' ')+'Z');
    this.waveGroup.nativeElement.style.transformOrigin = `120px ${cy*(1-travel)}px`;
    this.waveArrow.nativeElement.setAttribute('transform', `translate(${120+(-24-2*spread)*size} ${cy+(26*size-cy)*travel}) rotate(${-45*spread})`);
    this.linksContainer.nativeElement.style.transform = `translateY(${travel * (26 - cy)}px)`;
    this.socialTab.nativeElement.parentElement!.classList.toggle('wave-at-corner', p >= 0.999);
  }

  private scheduleOverlapCheck(): void {
    if (this.collisionFrame) return;
    this.collisionFrame = requestAnimationFrame(() => {
      this.collisionFrame = 0;
      this.checkOverlap();
    });
  }

  private checkOverlap(): void {
    if (!this.mobile?.matches || !this.pastHero) {
      this.avoidingContent = false;
      return;
    }
    const tab = this.socialTab.nativeElement;
    // Measure the normal footprint, even while visually shrunk, to avoid flicker.
    const centerY = tab.parentElement!.getBoundingClientRect().top + tab.parentElement!.offsetHeight / 2;
    const area = {left: window.innerWidth - 64, right: window.innerWidth,
      top: this.dockProgress > 0.8 ? 0 : centerY - 32,
      bottom: this.dockProgress > 0.8 ? 64 : centerY + 32};
    const overlaps = (rect: DOMRect) => rect.width > 0 && rect.height > 0 &&
      rect.left < area.right && rect.right > area.left && rect.top < area.bottom && rect.bottom > area.top;
    const candidates = new Set<Element>();
    for (let y = area.top; y <= area.bottom; y += 8) {
      for (const x of [area.left + 2, area.left + 22, area.right - 2]) {
        document.elementsFromPoint(x, y).forEach(element => {
          if (!tab.parentElement!.contains(element)) candidates.add(element);
        });
      }
    }
    this.avoidingContent = Array.from(candidates).some(element => {
      const control = element.closest('a, button, input, textarea, select, [role="button"], [tabindex]');
      if (control && overlaps(control.getBoundingClientRect())) return true;
      // Text ranges detect the letters themselves rather than large empty containers.
      return Array.from(element.childNodes).some(node => {
        if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) return false;
        const range = document.createRange();
        range.selectNodeContents(node);
        return Array.from(range.getClientRects()).some(overlaps);
      });
    });
  }

  toggleSocials(): void {
    this.expanded = !this.expanded;
  }

  ngOnDestroy(): void {
    this.mobile?.removeEventListener('change', this.onViewportChange);
    window.removeEventListener('resize', this.onViewportChange);
    window.removeEventListener('scroll', this.onScroll, true);
    clearTimeout(this.dockTimer);
    cancelAnimationFrame(this.collisionFrame);
    cancelAnimationFrame(this.dockFrame);
  }


  socialLinks: { name: string, icon: string, url: string }[] = [
    {
      name: 'LinkedIn',
      icon: 'assets/icons/linkedin.svg',
      url: 'https://www.linkedin.com/in/valentin-koparov-6875b11b9'
    },
    {
      name: 'GitHub',
      icon: 'assets/icons/github.svg',
      url: 'https://github.com/VKoparov'
    },
    {
      name: 'Upwork',
      icon: 'assets/icons/upwork.svg',
      url: 'https://www.upwork.com/freelancers/~0179fa2d8ab45e83ab'
    },
    {
      name: 'npm',
      icon: 'assets/icons/npm.svg',
      url: 'https://www.npmjs.com/~valik98'
    }
  ];
}
