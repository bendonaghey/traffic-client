import { Component } from '@angular/core';
import * as mapquest from 'mapquest';
import { Subject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Traffic Congestion';

  // initialise variables for map, key and locations
  baseUrl = 'https://open.mapquestapi.com/staticmap/v5/map?';
  key = 'eGjnmBVKciAGwk5W721NKLqNRL6J73Jy';
  locationA = '';
  locationB = '';

  // setting locations to subject observer in string arrays
  locationASubject = new Subject<string>();
  locationBSubject = new Subject<string>();

  // setting locations to observables
  locationA$ = this.locationASubject.asObservable();
  locationB$ = this.locationBSubject.asObservable();

  // placeholder map
  mapUrl =
    'https://open.mapquestapi.com/staticmap/v5/map?key=eGjnmBVKciAGwk5W721NKLqNRL6J73Jy&center=Derry&size=1000,700';

  constructor() {
    // combines both locations lat and long to mapURL string with key
    combineLatest(this.locationA$, this.locationB$).subscribe((res: any) => {
      this.mapUrl = `${this.baseUrl}start=${res[0].lat},${
        res[0].lng
      }%7Cflag-start&end=${res[1].lat},${res[1].lng}%7Cflag-end&size=@2x&key=${
        this.key
      }`;
    });
  }

  public generateMap() {
    // generates for user when button is clicked
    mapquest.geocode(
      { address: this.locationA, key: this.key },
      (err, location) => {
        console.log(location);
        this.locationASubject.next(location.latLng);
      }
    );

    mapquest.geocode(
      { address: this.locationB, key: this.key },
      (err, location) => {
        this.locationBSubject.next(location.latLng);
      }
    );
  }
}
