import json
import urllib
import urllib.request
from bs4 import BeautifulSoup

twitterUrl = "https://twitter.com/BenDonaghey"
twitterRequest = urllib.request.urlopen(twitterUrl)
soup = BeautifulSoup(twitterRequest, "html.parser")

extracted_jsonTweets = []

for tweets in soup.find_all('div', {"class": "js-tweet-text-container"}):
    scrapedTweet = tweets.find('p').text
    scrapedName = soup.title.text

jsonTweets = {
    'Name: ': scrapedName,
    'Tweet 1: ': scrapedTweet
}

extracted_jsonTweets.append(jsonTweets)
with open('scrapedTweets.json', 'w') as outfile:
    json.dump(extracted_jsonTweets, outfile)
