import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottomFadeComponent } from './bottom-fade.component';



@NgModule({
    declarations: [
        BottomFadeComponent
    ],
    exports: [
        BottomFadeComponent
    ],
    imports: [
        CommonModule
    ]
})
export class BottomFadeModule { }
