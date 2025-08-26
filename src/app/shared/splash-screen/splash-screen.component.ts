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
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss'],
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
    private t?: number;

    ngOnInit() {
        if (this.autoHideMs > 0) {
            this.t = window.setTimeout(() => this.finish(), this.autoHideMs);
        }
    }

    ngOnDestroy() {
        if (this.t) clearTimeout(this.t);
    }

    finish() {
        this.isFading = true;
    }

    @HostListener('transitionend')
    onFadeDone() {
        if (this.isFading) this.closed.emit();
    }
}
