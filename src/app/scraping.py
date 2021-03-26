import json
import urllib
import urllib.request
from bs4 import BeautifulSoup
import json
import boto3

API Key = '8j3z6P0uEAHD4xDfEHPXd2b9g'
Secret Key = '9Q53IhoxWOAP1HfoPB3XTAWb60LAEQl7rNCmXDKAWyGUNiSkij'

twitterUrl = "https://mobile.twitter.com/BenDonaghey"
twitterRequest = urllib.request.urlopen(twitterUrl)
soup = BeautifulSoup(twitterRequest, "html.parser")

extracted_jsonTweets = []

scrapedTweet = soup.find('p', class_="js-tweet-text-container")
# soup.find(
    # 'div', {"class": "js-tweet-text-container"}).find('p').text

# for tweet in soup.find_all('p', class_="tweet-text"):
#     print ' '.join([line.strip() for line in tweet.get_text().splitlines()])

scrapedName = soup.title.text

jsonTweets = {
    'name': scrapedName,
    'tweet': scrapedTweet
}

extracted_jsonTweets.append(jsonTweets)
with open('../assets/scrapedTweets.json', 'w') as outfile:
    json.dump(extracted_jsonTweets, outfile)

print("Script successfully executed")

# s3 = boto3.resource('s3')
# s3.Bucket('traffic-client-scrapes').upload_file('../assets/scrapedTweets.json','scrapedTweets.json')