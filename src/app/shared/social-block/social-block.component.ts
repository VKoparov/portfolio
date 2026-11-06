import {AfterViewInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';

@Component({
  selector: 'app-social-block',
  templateUrl: './social-block.component.html',
  styleUrls: ['./social-block.component.scss']
})
export class SocialBlockComponent implements AfterViewInit, OnDestroy {
  @ViewChild('socialTab', {static: true}) private socialTab!: ElementRef<HTMLElement>;
  avoidingContent = false;
  private collisionFrame = 0;
  pastHero = false;
  expanded = false;
  private mobile?: MediaQueryList;
  private heroObserver?: IntersectionObserver;
  private readonly onScroll = () => {
    if (this.mobile?.matches && this.pastHero && this.expanded) {
      this.expanded = false;
    }
    this.scheduleOverlapCheck();
  };
  private readonly onViewportChange = () => {
    this.expanded = false;
    this.observeHeroExit();
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
    this.observeHeroExit();
  }

  private observeHeroExit(): void {
    this.heroObserver?.disconnect();
    const hero = document.querySelector('.frame-container app-homepage .homepage-container');
    if (!hero) return;
    // Begin tucking the links away after the first 32px of hero scroll,
    // before the service cards below it enter the viewport.
    const exitLine = Math.max(0, window.innerHeight - 32);
    this.heroObserver = new IntersectionObserver(entries => {
      this.pastHero = entries[0].boundingClientRect.bottom <= exitLine;
      if (!this.pastHero) this.expanded = false;
      this.scheduleOverlapCheck();
    }, {threshold: 0, rootMargin: `-${exitLine}px 0px 0px 0px`});
    this.heroObserver.observe(hero);
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
    const area = {left: window.innerWidth - 48, right: window.innerWidth, top: centerY - 32, bottom: centerY + 32};
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
    this.heroObserver?.disconnect();
    this.mobile?.removeEventListener('change', this.onViewportChange);
    window.removeEventListener('resize', this.onViewportChange);
    window.removeEventListener('scroll', this.onScroll, true);
    cancelAnimationFrame(this.collisionFrame);
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
