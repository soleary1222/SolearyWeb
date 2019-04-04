import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div id="wrapper">
  <app-sidebar></app-sidebar>

  <!-- header -->
  <app-header></app-header>

  <!-- Begin Page Content -->
  <div class="container-fluid">

  <!-- routes will be rendered here -->
  <router-outlet></router-outlet>

  <!-- footer -->
  <app-footer></app-footer>
  </div>
  </div>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stephen OLeary\'s Assessment for Learn on Demand Systems';
}
