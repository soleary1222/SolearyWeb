import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService } from 'angular2-toaster';
import { ToasterModule } from 'angular2-toaster';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { AgmCoreModule } from '@agm/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { UsersComponent } from './pages/users/users.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ApiProvider } from 'src/providers/api';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: 'companies', component: CompaniesComponent },
  { path: 'users', component: UsersComponent },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
];

library.add(fas, far);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CompaniesComponent,
    UsersComponent,
    SidebarComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBrFrXmzirRZOcHlewA0VBMmtYXkzbvlqc'
    }),
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    ToasterModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule
  ],
  providers: [
    ToasterService,
    ApiProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
