import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-parallax-landing',
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
    const zoomStart = 0;
    const zoomEnd = 500;
    const zoomRange = zoomEnd - zoomStart;
    const zoomFactor = 0.7;
    const scrollPercent = Math.max(0, Math.min(1, scrollTop / zoomRange));
    const zoomAmount = 1 + scrollPercent * zoomFactor;
    const maxZoom = 1.8;
    const foregroundZoom = Math.min(maxZoom, zoomAmount);

    this.darkOverlay = `rgba(0, 0, 0, ${foregroundZoom - 1})`;

    this.foregroundTransform = `scale(${foregroundZoom})`;

    this.bottomOffset = `-${scrollTop}px`;

    if (foregroundZoom <= 1) {
      this.bottomOffset = '-0px';
    }
  }

  private downScaleLogo(scrollTop: number) {
    const zoomStart = 0;
    const zoomEnd = 500;
    const zoomRange = zoomEnd - zoomStart;
    const zoomFactor = 0.2;
    const scrollPercent = Math.max(0, Math.min(1, scrollTop / zoomRange));
    const zoomAmount = 1 + scrollPercent * zoomFactor;
    const maxZoom = 1.8;
    const foregroundZoom = Math.min(maxZoom, zoomAmount);

    this.logoTransform = `scale(${foregroundZoom})`;
  }
}
