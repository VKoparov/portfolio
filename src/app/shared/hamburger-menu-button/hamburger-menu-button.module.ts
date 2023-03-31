import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HamburgerMenuButtonComponent } from './hamburger-menu-button.component';



@NgModule({
    declarations: [
        HamburgerMenuButtonComponent
    ],
    exports: [
        HamburgerMenuButtonComponent
    ],
    imports: [
        CommonModule
    ]
})
export class HamburgerMenuButtonModule { }
