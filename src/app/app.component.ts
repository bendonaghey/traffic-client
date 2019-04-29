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
export class AppComponent {
  title = 'Traffic Congestion Client';

  // initialise variables for map, key and locations
  baseUrl = 'https://open.mapquestapi.com/staticmap/v5/map?';
  key = 'eGjnmBVKciAGwk5W721NKLqNRL6J73Jy';
  locationA = '';
  locationB = '';

  latestTweet = 'Tweet Info..';
  userTweet = 'User';

  trafficUpdate = 'Traffic Information here';
  returnWord: string;

  // setting emitter for when locations are returned from map quest
  locationASubject = new Subject<string>();
  locationBSubject = new Subject<string>();

  // setting up listeners for subject emitters
  locationA$ = this.locationASubject.asObservable();
  locationB$ = this.locationBSubject.asObservable();

  // placeholder map
  mapUrl =
    'https://open.mapquestapi.com/staticmap/v5/map?key=eGjnmBVKciAGwk5W721NKLqNRL6J73Jy&center=Derry&size=1400,900';

  constructor(private httpClient: HttpClient) {
    // combines both locations lat and long to mapURL string with key
    combineLatest(this.locationA$, this.locationB$).subscribe((res: any) => {
      this.mapUrl = `${this.baseUrl}start=${res[0].lat},${
        res[0].lng
      }%7Cflag-start&end=${res[1].lat},${
        res[1].lng
      }%7Cflag-end&size=1400,900&key=${this.key}`;
    });
  }

  public generateMap() {
    // updat user with current tweet and username
    this.httpClient
      .get('../assets/scrapedTweets.json')
      .pipe(map(data => data[0]))
      .subscribe(data => {
        this.latestTweet = data.tweet;
        this.userTweet = data.name;
        this.searchTweet(this.latestTweet, this.locationA, this.locationB);
      });

    // async calls to mapquest to get lat and lng for locationA
    mapquest.geocode(
      { address: this.locationA, key: this.key },
      (err, location) => {
        this.locationASubject.next(location.latLng);
      }
    );

    // async calls to mapquest to get lat and lng for locationB
    mapquest.geocode(
      { address: this.locationB, key: this.key },
      (err, location) => {
        this.locationBSubject.next(location.latLng);
      }
    );
  }

  private searchTweet(tweet: string, locationA: string, locationB: string) {
    const wordArray = tweet.split(' ');
    const keyWords = ['bad', 'good', 'congested', 'slow', 'heavy'];
    let locationAFound: boolean;
    let locationBFound: boolean;
    let keywordFound = false;

    // trimming locationA and locationB and checking if in tweet
    wordArray.forEach(word => {
      const trimmedWord = word.replace(/[.,\s]/g, '');

      if (trimmedWord.toLowerCase() === locationA.toLowerCase()) {
        locationAFound = true;
      }
      if (trimmedWord.toLowerCase() === locationB.toLowerCase()) {
        locationBFound = true;
      }
    });

    // trimming keyword and checking if in tweet
    if (locationAFound && locationBFound) {
      wordArray.forEach(word => {
        const trimmedWord = word.replace(/[.,\s]/g, '');
        if (keyWords.includes(trimmedWord.toLowerCase())) {
          keywordFound = true;
          this.returnWord = trimmedWord;
        }
      });

      if (keywordFound) {
        this.trafficUpdate = `The traffic is "${this.returnWord.toLowerCase()}" between these locations`;
      }
    } else {
      this.trafficUpdate = 'No known traffic between these locations';
    }
  }
}
