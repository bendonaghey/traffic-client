import json
import urllib
import urllib.request
from bs4 import BeautifulSoup
import json
import boto3
import tweepy
from tweepy import OAuthHandler
import pandas as pd

access_token = '322133272-kZNoz2zDmOs97giM1WzYZSwHqpcR9iezXlNA224D'
access_token_secret = '1NsiktyTVE3FPl5a1cwkrMPvlGs74Mb5R0xtgqww6VkEC'
consumer_key = 'LQ1Z8YtdVWYwb3aT1HAi74MRA'
consumer_secret = 'nkQNZqjM1OWzp72VFcWiKMafjLvOhavxWWj9eN9aoW4DLi2bQe'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())

scrapedTweet = api.user_timeline()
extracted_jsonTweets = []

for tweet in scrapedTweet:
    print(tweet)

jsonTweets = {
    # 'name': scrapedName,
    'tweet': tweet
}

extracted_jsonTweets.append(jsonTweets)
with open('../assets/scrapedTweets.json', 'w') as outfile:
    json.dump(extracted_jsonTweets, outfile)

print("Script successfully executed")

# s3 = boto3.resource('s3')
# s3.Bucket('traffic-client-scrapes').upload_file('../assets/scrapedTweets.json','scrapedTweets.json')