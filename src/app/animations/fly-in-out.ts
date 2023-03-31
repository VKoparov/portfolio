import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from "@angular/animations";

export const flyInOut: AnimationTriggerMetadata = trigger('flyInOut', [
    state('in', style({opacity: 1, transform: 'translateY(0)'})),
    transition('void => *', [
        style({opacity: 0, transform: 'translateY(100%)'}),
        animate(800)
    ]),
    transition('* => void', [
        animate(800, style({opacity: 0, transform: 'translateY(0)'}))
    ])
]);
