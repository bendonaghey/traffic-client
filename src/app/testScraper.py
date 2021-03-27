import tweepy
from tweepy import OAuthHandler
import pandas as pd
import json
import boto3

access_token = '322133272-kZNoz2zDmOs97giM1WzYZSwHqpcR9iezXlNA224D'
access_token_secret = '1NsiktyTVE3FPl5a1cwkrMPvlGs74Mb5R0xtgqww6VkEC'
consumer_key = 'LQ1Z8YtdVWYwb3aT1HAi74MRA'
consumer_secret = 'nkQNZqjM1OWzp72VFcWiKMafjLvOhavxWWj9eN9aoW4DLi2bQe'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
s3 = boto3.resource('s3')
api = tweepy.API(auth)
extracted_jsonTweets = []

username = 'BenDonaghey'
count = 50
try:
    tweets = tweepy.Cursor(api.user_timeline).items(count)
    tweets_list = [[tweet.text] for tweet in tweets]

    jsonTweets = {
        'Twitter Handle': username,
        'Tweets': tweets_list
    }

    extracted_jsonTweets.append(jsonTweets)
    with open('../assets/scrapedTweets.json', 'w') as outfile:
        json.dump(extracted_jsonTweets, outfile)

    s3.Bucket('traffic-client-scrapes').upload_file('../assets/scrapedTweets.json',
                                                    'scrapedTweets.json', ExtraArgs={'ContentType': "application/json"})

except BaseException as e:
    print('failed on_status,', str(e))
