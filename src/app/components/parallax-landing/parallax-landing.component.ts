import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './parallax-landing.component.html',
  styleUrls: ['./parallax-landing.component.scss']
})
export class ParallaxLandingComponent {

  darkOverlay: string = 'rgba(0, 0, 0, .0)';

  foregroundTransform: string = 'scale(1)';

  logoTransform: string = 'scale(1)';

  bottomOffset: string = '-0px';

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.scaleForeground(scrollTop);
    this.downScaleLogo(scrollTop);
  }

  private scaleForeground(scrollTop: number) {
    const zoomFactor = 0.7;
    const maxZoom = 1.8;
    const zoomAmount = this.calculateZoom(scrollTop, zoomFactor, maxZoom);
    const bottomOffset = scrollTop <= 0 ? '0px' : `-${scrollTop}px`;

    this.darkOverlay = `rgba(0, 0, 0, ${zoomAmount - 1})`;
    this.foregroundTransform = `scale(${zoomAmount})`;
    this.bottomOffset = bottomOffset;
  }

  private downScaleLogo(scrollTop: number) {
    const zoomFactor = 0.2;
    const maxZoom = 1.8;
    const zoomAmount = this.calculateZoom(scrollTop, zoomFactor, maxZoom);

    this.logoTransform = `scale(${zoomAmount})`;
  }

  private calculateZoom(scrollTop: number, zoomFactor: number, maxZoom: number): number {
    const zoomStart = 0;
    const zoomEnd = 500;
    const zoomRange = zoomEnd - zoomStart;
    const scrollPercent = Math.max(0, Math.min(1, scrollTop / zoomRange));
    const zoomAmount = 1 + scrollPercent * zoomFactor;

    return Math.min(maxZoom, zoomAmount);
  }
}
