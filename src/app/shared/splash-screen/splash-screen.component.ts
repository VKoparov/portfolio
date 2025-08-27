import {
    ApplicationRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {fromEvent, combineLatest, of} from 'rxjs';
import {filter, take} from 'rxjs/operators';

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

    @Input() autoHideMs = 5800;
    @Output() closed = new EventEmitter<void>();

    isFading = false;
    private t?: number;

    constructor(private appRef: ApplicationRef) {
    }

    ngOnInit() {
        if (this.autoHideMs > 0) {
            this.t = window.setTimeout(() => this.finish(), this.autoHideMs);
        }

        const isStable$ = this.appRef.isStable.pipe(filter(stable => !!stable), take(1));
        const windowLoaded$ = (document.readyState === 'complete')
            ? of(true)
            : fromEvent(window as any, 'load').pipe(take(1));

        combineLatest([isStable$, windowLoaded$])
            .pipe(take(1))
            .subscribe(() => {
                this.finish();
            });
    }

    ngOnDestroy() {
        if (this.t) clearTimeout(this.t);
    }

    finish() {
        if (this.t) {
            clearTimeout(this.t);
            this.t = undefined;
        }
        this.isFading = true;
    }

    @HostListener('transitionend')
    onFadeDone() {
        if (this.isFading) this.closed.emit();
    }
}
