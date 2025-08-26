import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-splash-screen',
    template: `
    <div class="wrap" role="status" aria-live="polite">
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="wb" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="50%" stop-color="#86cfff" />
            <stop offset="100%" stop-color="#ffffff" />
          </linearGradient>
        </defs>

        <polyline
          class="mountain"
          pathLength="1"
          points="
            0,300 60,290 120,296 180,282 240,290 300,272 360,280 420,262 480,268 520,248 560,220 580,195 600,172 620,158 640,150 660,138 680,152 700,176 720,202 740,218 760,230 780,238 800,244 820,242 840,236 860,240 880,246 900,244 920,242 940,248 960,254 980,260 1000,268 1040,276 1080,286 1120,294 1160,298 1200,300
          " />
      </svg>
    </div>
  `,
    styles: [`
      :host {
        position: fixed;
        inset: 0;
        background: #000; /* black background */
        display: grid;
        place-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity .5s ease;
      }

      :host(.fade-out) {
        opacity: 0;
        pointer-events: none;
      }

      .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        user-select: none;
      }

      svg {
        width: 100vw;
        height: auto;
        overflow: visible;
      }

      .mountain {
        fill: none;
        stroke: url(#wb);
        stroke-width: .5;
        stroke-linecap: round;
        stroke-linejoin: round;

        /* "draw" effect */
        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        animation: draw 5.8s ease-out forwards,
        afterglow 1.2s ease-in-out 1.8s 1 forwards;
        filter: drop-shadow(0 0 12px rgba(134, 207, 255, 0.65));
      }

      .label {
        color: #cfeaff;
        font: 500 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Inter, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        opacity: .8;
      }

      @keyframes draw {
        to {
          stroke-dashoffset: 0;
        }
      }

      @keyframes afterglow {
        0% {
          filter: drop-shadow(0 0 12px rgba(134, 207, 255, 0.65));
        }
        100% {
          filter: drop-shadow(0 0 0 rgba(134, 207, 255, 0));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .mountain {
          animation: none;
          stroke-dashoffset: 0;
        }
      }
    `],
    host: {
        '[class.fade-out]': 'isFading',
        'aria-busy': 'true',
        'aria-label': 'Loading',
    }
})
export class SplashScreenComponent implements OnInit, OnDestroy {

    @Input() autoHideMs = 6800;
    @Output() closed = new EventEmitter<void>();

    isFading = false;
    private t?: number;

    ngOnInit() {
        if (this.autoHideMs > 0) {
            this.t = window.setTimeout(() => this.finish(), this.autoHideMs);
        }
    }

    ngOnDestroy() {
        if (this.t) clearTimeout(this.t);
    }

    @HostListener('transitionend')
    onFadeDone() {
        if (this.isFading) this.closed.emit();
    }

    finish() {
        this.isFading = true;
    }
}
