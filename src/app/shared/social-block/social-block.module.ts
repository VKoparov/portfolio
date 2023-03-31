import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialBlockComponent } from './social-block.component';



@NgModule({
    declarations: [
        SocialBlockComponent
    ],
    exports: [
        SocialBlockComponent
    ],
    imports: [
        CommonModule
    ]
})
export class SocialBlockModule { }
