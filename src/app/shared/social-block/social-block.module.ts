import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { SocialBlockComponent } from './social-block.component';



@NgModule({
    declarations: [
        SocialBlockComponent
    ],
    exports: [
        SocialBlockComponent
    ],
    imports: [
        CommonModule,
        NgOptimizedImage
    ]
})
export class SocialBlockModule { }
