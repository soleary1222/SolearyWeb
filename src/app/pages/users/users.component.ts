import { OnInit, Component, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ApiProvider } from 'src/providers/api';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Location } from './../../models/location';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  constructor(private api: ApiProvider, private toasterService: ToasterService) { }

  companies: any;
  users: any;
  itemobject: any;
  addEdit = false;
  detail = false;
  saving = false;
  user: any;

  // uploading stuff
 uploading = false;
 documents: any[];
 uploadfile: any;
 selectedFiles: any[];
 description: string;
 documentTypeID: any;
 otherdescription: string;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.genericGet('/Users').then((data) => {
      this.users = data;
    });
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
    this.detail = true;
  }

  delete(d) {
    this.api.genericDelete('/Users/' + d.UserID).then(() => {
      this.toasterService.popAsync({
        type: 'success',
        title: 'Success',
        body: 'User Deleted',
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

      if (this.itemobject.UserID) {
        const postobj = Object.assign({}, this.itemobject);
        delete postobj.Company;
        postobj.Latitude = postobj.Latitude + '';
        postobj.Longitude = postobj.Longitude + '';

        this.api.genericPut('/Users', this.itemobject.UserID, postobj).then((data: any[]) => {
          this.loadData();
          this.addEdit = false;
          this.toasterService.popAsync({
            type: 'success',
            title: 'Success',
            body: 'User Updated',
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          });
          if (this.selectedFiles) {
            this.uploadFile();
          }
          this.saving = false;
        });
      } else {
        const company = this.companies.filter((d) => d.CompanyID === this.itemobject.CompanyID)[0];
        this.api.genericPost('/Users', this.itemobject).then((data: any) => {
          this.loadData();
          this.addEdit = false;
          this.toasterService.popAsync({
            type: 'success',
            title: 'Success',
            body: 'User Created',
            timeout: 5000,
            showCloseButton: true,
            bodyOutputType: BodyOutputType.TrustedHtml,
          });
          if (this.selectedFiles) {
            this.uploadFile();
          }
          data.Company = company;
          this.view(data);
          this.saving = false;
        });
      }

    });


  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('files', this.selectedFiles[0]);
    this.api.formDataPost('/Custom/UploadProfileImage/' + this.itemobject.UserID, formData).then(() => {
    });
  }

}
