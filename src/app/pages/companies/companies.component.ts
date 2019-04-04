import { OnInit, Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ApiProvider } from 'src/providers/api';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Location } from './../../models/location';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})

export class CompaniesComponent implements OnInit {

  companies: any;
  itemobject: any;
  addEdit = false;
  detail = false;
  saving = false;
  company: any;
  companyusers: any;


  constructor(private api: ApiProvider, private toasterService: ToasterService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.genericGet('/Companies').then((data) => {
      this.companies = data;
    });
  }

  addNew() {
    this.itemobject = {};
    this.addEdit = true;
  }

  edit(d) {
    this.itemobject = d;
    this.addEdit = true;
  }

  view(d) {
    this.itemobject = d;
    this.companyusers = d.Users;
    this.detail = true;
  }

  delete(d) {
    this.api.genericDelete('/Companies/' + d.CompanyID).then(() => {
      this.toasterService.popAsync({
        type: 'success',
        title: 'Success',
        body: 'Company Deleted',
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      });
      this.loadData();
    });
  }

  save() {
    this.saving = true;
    if (!this.itemobject.Address || !this.itemobject.City || !this.itemobject.StateAbbrev
      || !this.itemobject.Zip || !this.itemobject.Name) {
      this.toasterService.popAsync({
        type: 'error',
        title: 'Error',
        body: 'Please Complete All Required Fields',
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      });
      this.saving = false;
      return;
    }

    this.api.geocodeAddress(this.itemobject.Address + ' ' + this.itemobject.City + ' ' +
      this.itemobject.StateAbbrev + ' ' + this.itemobject.Zip
    ).subscribe((location: Location) => {
      this.itemobject.Latitude = location.lat;
      this.itemobject.Longitude = location.lng;

      if (this.itemobject.CompanyID) {
        const postobj = Object.assign({}, this.itemobject);
        delete postobj.Users;

        this.api.genericPut('/Companies', this.itemobject.CompanyID, postobj).then((data: any[]) => {
          this.loadData();
          this.addEdit = false;
          this.toasterService.popAsync({
            type: 'success',
            title: 'Success',
            body: 'Company Updated',
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          });
          this.saving = false;
        });
      } else {
        this.api.genericPost('/Companies', this.itemobject).then((data: any) => {
          this.loadData();
          this.addEdit = false;
          this.toasterService.popAsync({
            type: 'success',
            title: 'Success',
            body: 'Company Created',
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          });
          this.view(data);
          this.saving = false;
          this.api.genericPost('/Custom/NotifyUser',  {Email: this.itemobject.ContactEmail, NotificationType: 3});
        });
      }

    }
    );


  }
}
