import { Component, OnInit } from '@angular/core';
import * as mapquest from 'mapquest';
import { Subject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Traffic Congestion';

  // initialise variables for map, key and locations
  baseUrl = 'https://open.mapquestapi.com/staticmap/v5/map?';
  key = 'eGjnmBVKciAGwk5W721NKLqNRL6J73Jy';
  locationA = '';
  locationB = '';

  latestTweet = 'Tweet Info..';

  // setting locations to subject observer in string arrays
  locationASubject = new Subject<string>();
  locationBSubject = new Subject<string>();

  // setting locations to observables
  locationA$ = this.locationASubject.asObservable();
  locationB$ = this.locationBSubject.asObservable();

  // placeholder map
  mapUrl =
    'https://open.mapquestapi.com/staticmap/v5/map?key=eGjnmBVKciAGwk5W721NKLqNRL6J73Jy&center=Derry&size=1000,700';

  constructor(private httpClient: HttpClient) {
    // combines both locations lat and long to mapURL string with key
    combineLatest(this.locationA$, this.locationB$).subscribe((res: any) => {
      this.mapUrl = `${this.baseUrl}start=${res[0].lat},${
        res[0].lng
      }%7Cflag-start&end=${res[1].lat},${res[1].lng}%7Cflag-end&size=@2x&key=${
        this.key
      }`;
    });
  }

  ngOnInit() {}

  public generateMap() {
    // generates for user when button is clicked
    this.httpClient
      .get('../assets/scrapedTweets.json')
      .pipe(map(data => data[0]))
      .subscribe(data => {
        this.latestTweet = data.tweet;
        console.log(this.latestTweet);
      });

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
