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
                    <!-- mountain stroke gradient -->
                    <linearGradient id="wb" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#ffffff" />
                        <stop offset="50%" stop-color="#86cfff" />
                        <stop offset="100%" stop-color="#ffffff" />
                    </linearGradient>

                    <!-- fade mask: white = visible, black = transparent -->
                    <linearGradient id="fadeMask" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="7%"   stop-color="black"/>
                        <stop offset="25%"  stop-color="white"/>
                        <stop offset="75%"  stop-color="white"/>
                        <stop offset="93%" stop-color="black"/>
                    </linearGradient>
                    <mask id="edgeFade">
                        <rect x="0" y="0" width="1200" height="400" fill="url(#fadeMask)" />
                    </mask>
                </defs>

                <!-- mountain path with fade applied -->
                <g mask="url(#edgeFade)">
                    <polyline
                            class="mountain"
                            pathLength="1"
                            points="
              0,300 60,296 120,292 180,288 240,280 300,270
              360,258 420,244 480,230 520,212 540,200 560,188
              580,198 600,186 620,172 640,160 660,148 680,152
              700,176 720,202 740,220 760,232 780,240 800,246
              820,244 840,238 860,242 880,248 900,246 920,244
              940,250 960,256 980,262 1000,270 1040,280 1080,290
              1120,296 1160,300 1200,302
            " />
                </g>
            </svg>
        </div>
    `,
    styles: [`
      :host {
        position: fixed;
        inset: 0;
        background: #000;
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

      svg {
        width: 100vw;
        height: auto;
        overflow: visible;
      }

      .mountain {
        fill: none;
        stroke: url(#wb);
        stroke-width: .3;
        stroke-linecap: round;
        stroke-linejoin: round;

        stroke-dasharray: 1;
        stroke-dashoffset: 1;
        animation: draw 5.8s ease-out forwards,
        afterglow 1.2s ease-in-out 5.8s 1 forwards;
        filter: drop-shadow(0 0 12px rgba(134, 207, 255, 0.65));
      }

      @keyframes draw { to { stroke-dashoffset: 0; } }
      @keyframes afterglow {
        0%   { filter: drop-shadow(0 0 12px rgba(134, 207, 255, 0.65)); }
        100% { filter: drop-shadow(0 0 0 rgba(134, 207, 255, 0)); }
      }

      @media (prefers-reduced-motion: reduce) {
        .mountain { animation: none; stroke-dashoffset: 0; }
      }
    `],
    host: {
        '[class.fade-out]': 'isFading',
        'aria-busy': 'true',
        'aria-label': 'Loading',
    }
})
export class SplashScreenComponent implements OnInit, OnDestroy {
    @Input() autoHideMs = 6200;
    @Output() closed = new EventEmitter<void>();

    isFading = false;
    private timer?: number;

    ngOnInit() {
        if (this.autoHideMs > 0) {
            this.timer = window.setTimeout(() => this.finish(), this.autoHideMs);
        }
    }
    ngOnDestroy() { if (this.timer) clearTimeout(this.timer); }

    @HostListener('transitionend')
    onFadeDone() {
        if (this.isFading) this.closed.emit();
    }

    finish() { this.isFading = true; }
}
