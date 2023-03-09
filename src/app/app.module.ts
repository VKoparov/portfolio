import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FrameComponent } from './components/frame/frame.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { ToolsComponent } from './components/tools/tools.component';
import { EnterTheViewportNotifierDirective } from './directives/enter-the-viewport-notifier.directive';
import { WhatIDoComponent } from './components/what-i-do/what-i-do.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { StickyDirective } from './directives/sticky.directive';
import { HorizontalScrollDirective } from './directives/horizontal-scroll.directive';
import { HorizontalScrollSnapDirective } from './directives/horizontal-scroll-snap.directive';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { ParallaxLandingComponent } from './components/parallax-landing/parallax-landing.component';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent,
    NavigationBarComponent,
    AboutMeComponent,
    ToolsComponent,
    EnterTheViewportNotifierDirective,
    WhatIDoComponent,
    ProjectsComponent,
    ContactsComponent,
    StickyDirective,
    HorizontalScrollDirective,
    HorizontalScrollSnapDirective,
    ReviewsComponent,
    SideBarComponent,
    SideBarComponent,
    ParallaxLandingComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
