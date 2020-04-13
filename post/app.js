// app.js

var Twitter = require('twitter');
var config = require('./config.js');
var T = new Twitter(config);
const fs = require('fs');

fs.readFile('whichList.txt', 'utf8', (err, data) => {
  if (err) throw err;

  data = data.split("\n");
  console.log("whichList.txt data: " + data);

  if(data[0] == "gibberish"){
    if(parseInt(data[1]) >= 4){
      // invert to other list
      data[0] = "story";
      data[1] = 1;

      postFromStory();
    } else {
      // continue posting on this list
      data[1] = parseInt(data[1]) + 1;

      postFromGibberish();
    }
  } else if(data[0] == "story"){
    if(parseInt(data[1]) >= 4){
      // invert to other list
      data[0] = "gibberish";
      data[1] = 1;

      postFromGibberish();
    } else {
      // continue posting on this list
      data[1] = parseInt(data[1]) + 1;

      postFromStory();
    }
  }

  outputArray = [data[0], data[1]];
  output = ""
  for(i = 0; i < outputArray.length; i++){
    output = output + outputArray[i] + "\n";
  }

  // write back to whichList.txt file
  fs.writeFile('whichList.txt', output, (err) => {
    if (err) throw err;

    console.log("Wrote back updated whichList.txt");
  })
});

function postFromGibberish(){
  // get new potential tweets from file
  fs.readFile('botTweetsFutureGibberish.txt', (err, data) => {
    if (err) throw err;

    lines = (data+"").replace(/\n$/, '').split('\n');

    // choose random line to select for today's tweet
    lineIndex = Math.floor(Math.random() * lines.length);
    theLine = lines[lineIndex];

    lines.splice(lineIndex, 1);

    console.log(theLine);

    // log that that tweet has been posted
    fs.appendFile('botTweetsPastGibberish.txt', theLine + "\n", (err) => {
      if (err) throw err;

      console.log("Appended tweet to past tweets file.");
    })

    // remove the tweet we just posted from the need to tweet file
    output = ""
    for(i = 0; i < lines.length; i++){
      output = output + lines[i] + "\n";
    }

    fs.writeFile('botTweetsFutureGibberish.txt', output, (err) => {
      if (err) throw err;

      console.log("Wrote back to file without our fancy line.");
    })

    // initiate send our new tweet
    sendTweet(theLine);
  })
}

function postFromStory(){
  fs.readFile('botTweetsFutureStory.txt', (err, data) => {
    if (err) throw err;

    lines = (data + "").replace(/\n$/, '').split('\n');

    // choose first line so that it posts in order
    lineIndex = 0;
    theLine = lines[lineIndex];

    lines.splice(lineIndex, 1);

    console.log(theLine);

    fs.appendFile('botTweetsPastStory.txt', theLine + "\n", (err) => {
      if (err) throw err;

      console.log("Appended tweet to past tweets file.");
    })

    output = "";
    for(i = 0; i < lines.length; i++){
      output = output + lines[i] + "\n";
    }

    fs.writeFile('botTweetsFutureStory.txt', output, (err) => {
      if (err) throw err;

      console.log("Wrote back to file without the tweeted line.");
    })

    sendTweet(theLine);
  })
}

function sendTweet(tweetBody){
  T.post('statuses/update', {status: tweetBody}, function(error, tweet, response) {

    if (!error){
      console.log(tweet);
    }
  })
}


// since_id = 0
//
// fs.readFile('next_cap.txt', (err, data) => {
//   if (err) throw err;
//   since_id = "" + data;
//
//   getTweets(since_id);
// })
//
//
// function getTweets(since_id){
//   console.log("since_id" + since_id)
//   // since_id: since_id , 1248330536508162055 (at time of writing) most recent tweet grabbed
//   // max_id: most old tweet grabbed
//   T.get('statuses/user_timeline', {screen_name: 'grootjohhny', count: 200, tweet_mode: 'extended', include_rts: 'False', since_id: since_id}, function(error, tweets, response) {
//     console.log(tweets);
//     for(i = 0; i < tweets.length; i++){
//       tweet = tweets[i];
//       tweetTextArray = (tweet['full_text']).split('\n');
//       tweetText = "";
//       for(j = 0; j < tweetTextArray.length; j++){
//         if(tweetTextArray[j] != ""){
//           tweetText = tweetText + tweetTextArray[j] + " ";
//         }
//       }
//
//       tweetText = tweetText + "\n";
//       console.log("tweet text: " + tweetText);
//       fs.appendFile('johhnygroottweets.txt', tweetText, (err) => {
//         if (err) throw err;
//
//         console.log("Tweet #" + i + " (" + truncateString(tweetText, 15) + ") written to file");
//       })
//
//       if(i == 0){
//         fs.writeFile('most_recent.txt', tweet['id'], (err) => {
//           if (err) throw err;
//
//           console.log("wrote most recent tweet id#" + tweet['id']);
//         });
//       }
//
//       if(i == tweets.length - 1){
//         fs.writeFile('most_oldest.txt', tweet['id'], (err) => {
//           if (err) throw err;
//
//           console.log("wrote most oldest tweet id#" + tweet['id']);
//         });
//       }
//     }
//   })
// }
//
// // stolen from medium.com LMAO
// function truncateString(str, num){
//   if(str.length <= num) {
//     return str;
//   }
//
//   return str.slice(0, num + "...");
// }
