import {animate, AnimationTriggerMetadata, style, transition, trigger} from "@angular/animations";

export const fade: AnimationTriggerMetadata = trigger('fade', [
    transition('void => *', [
        style({opacity: 0}),
        animate(300, style({opacity: 1}))
    ]),
    transition('* => void', [
        style({opacity: 1}),
        animate(300, style({opacity: 0}))
    ])
]);
