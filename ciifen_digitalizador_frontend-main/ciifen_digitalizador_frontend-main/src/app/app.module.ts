import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

import { LayoutModule } from "./views/layout/layout.module";
import { AuthGuard } from "./core/guard/auth.guard";

import { AppComponent } from "./app.component";
import { ErrorPageComponent } from "./views/pages/error-page/error-page.component";

import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { EventListComponent } from "./views/pages/events-manager/event-list/event-list.component";
import { EventDetailComponent } from "./views/pages/events-manager/event-detail/event-detail.component";
import { AuthInterceptorService } from "./services/auth/auth-interceptor.service";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    EventListComponent,
    EventDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import("highlight.js/lib/core"),
        languages: {
          xml: () => import("highlight.js/lib/languages/xml"),
          typescript: () => import("highlight.js/lib/languages/typescript"),
          scss: () => import("highlight.js/lib/languages/scss"),
        },
      },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
