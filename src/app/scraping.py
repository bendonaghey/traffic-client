import json
import urllib
import urllib.request
from bs4 import BeautifulSoup

twitterUrl = "https://twitter.com/BenDonaghey"
twitterRequest = urllib.request.urlopen(twitterUrl)
soup = BeautifulSoup(twitterRequest, "html.parser")

extracted_jsonTweets = []

scrapedTweet = soup.find(
    'div', {"class": "js-tweet-text-container"}).find('p').text
scrapedName = soup.title.text

jsonTweets = {
    'name': scrapedName,
    'tweet': scrapedTweet
}

extracted_jsonTweets.append(jsonTweets)
with open('../assets/scrapedTweets.json', 'w') as outfile:
    json.dump(extracted_jsonTweets, outfile)
