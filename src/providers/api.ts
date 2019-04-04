import { HttpClient , HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { RequestOptions, Request, RequestMethod, Headers} from '@angular/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { MapsAPILoader } from '@agm/core';
import { Location } from './../app/models/location';

declare var google: any;

@Injectable()
export class ApiProvider {
  private apiUrl = 'https://solearyapi.azurewebsites.net/api';
  private geocoder: any;

  constructor(public http: HttpClient, private mapLoader: MapsAPILoader) {
    console.log('Hello ServerProvider Provider');
  }

  genericGet(endpoint) {
      return new Promise(async (resolve) => {
          this.http.get(this.apiUrl + endpoint).subscribe(data =>  {
            // return data;
            resolve(data);
          },
          (error) => {
            resolve(error);
          });
        });
  }

  genericPost(endpoint, object) {
    return new Promise(async (resolve) => {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json'});
      const options = { headers: headers };
      this.http.post(this.apiUrl + endpoint, JSON.stringify(object), options).subscribe(data =>  {
        // console.log(data)
       // this.storage.set("login", data)
       // this.storage.set("idUser", data[0].id);
        // console.log("Get login complete");
        resolve(data);
      },
      (error) => {
          resolve(false);
      });
    });
  }

  formDataPost(endpoint, object) {
    return new Promise(async (resolve) => {
      // let headers = new HttpHeaders({
      //     'Content-Type': 'application/json'});
      // let options = { headers: headers };
      this.http.post(this.apiUrl + endpoint, object).subscribe(data =>  {
        // console.log(data)
       // this.storage.set("login", data)
       // this.storage.set("idUser", data[0].id);
        // console.log("Get login complete");
        resolve(data);
      },
      (error) => {
          resolve(false);
      });
    });
  }

  genericPut(endpoint, id, object) {
    return new Promise(async (resolve) => {
      const headers = new HttpHeaders({
          'Content-Type': 'application/json'});
      const options = { headers: headers };
      this.http.put(this.apiUrl + endpoint + '/' + id, JSON.stringify(object), options).subscribe(data =>  {
        // console.log(data)
       // this.storage.set("login", data)
       // this.storage.set("idUser", data[0].id);
        // console.log("Get login complete");
        resolve(data);
      },
      (error) => {
          resolve(false);
      });
    });
  }

  genericDelete(endpoint) {
    return new Promise(async (resolve) => {
        this.http.delete(this.apiUrl + endpoint).subscribe(data =>  {
          // return data;
          resolve(true);
        },
        (error) => {
          resolve(false);
        });
      });
}


  private initGeocoder() {
    console.log('Init geocoder!');
    this.geocoder = new google.maps.Geocoder();
  }

  private waitForMapsToLoad(): Observable<boolean> {
    if (!this.geocoder) {
      return from(this.mapLoader.load())
      .pipe(
        tap(() => this.initGeocoder()),
        map(() => true)
      );
    }
    return of(true);
  }

  geocodeAddress(location: string): Observable<Location> {
    console.log('Start geocoding!');
    return this.waitForMapsToLoad().pipe(
      // filter(loaded => loaded),
      switchMap(() => {
        return new Observable(observer => {
          this.geocoder.geocode({'address': location}, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              console.log('Geocoding complete!');
              observer.next({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              });
            } else {
                console.log('Error - ', results, ' & Status - ', status);
                observer.next({ lat: 0, lng: 0 });
            }
            observer.complete();
          });
        });
      })
    );
  }



}
