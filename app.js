// app.js

var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);
const fs = require('fs');

// T.post('statuses/update', {status: 'I am a tweet'}, function(error, tweet, response) {
//
//   if (!error){
//     console.log(tweet);
//   }
// })

since_id = 0

fs.readFile('next_cap.txt', (err, data) => {
  if (err) throw err;
  since_id = "" + data;

  getTweets(since_id);
})


function getTweets(since_id){
  console.log("since_id" + since_id)
  // since_id: since_id , 1248330536508162055 (at time of writing) most recent tweet grabbed
  // max_id: most old tweet grabbed
  T.get('statuses/user_timeline', {screen_name: 'grootjohhny', count: 200, tweet_mode: 'extended', include_rts: 'False', since_id: since_id}, function(error, tweets, response) {
    console.log(tweets);
    for(i = 0; i < tweets.length; i++){
      tweet = tweets[i];
      tweetTextArray = (tweet['full_text']).split('\n');
      tweetText = "";
      for(j = 0; j < tweetTextArray.length; j++){
        if(tweetTextArray[j] != ""){
          tweetText = tweetText + tweetTextArray[j] + " ";
        }
      }

      tweetText = tweetText + "\n";
      console.log("tweet text: " + tweetText);
      fs.appendFile('johhnygroottweets.txt', tweetText, (err) => {
        if (err) throw err;

        console.log("Tweet #" + i + " (" + truncateString(tweetText, 15) + ") written to file");
      })

      if(i == 0){
        fs.writeFile('most_recent.txt', tweet['id'], (err) => {
          if (err) throw err;

          console.log("wrote most recent tweet id#" + tweet['id']);
        });
      }

      if(i == tweets.length - 1){
        fs.writeFile('most_oldest.txt', tweet['id'], (err) => {
          if (err) throw err;

          console.log("wrote most oldest tweet id#" + tweet['id']);
        });
      }
    }
  })
}

// stolen from medium.com LMAO
function truncateString(str, num){
  if(str.length <= num) {
    return str;
  }

  return str.slice(0, num + "...");
}
