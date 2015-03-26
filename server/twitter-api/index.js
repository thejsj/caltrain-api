var Twit = require('twit');
var _ = require('lodash');
var moment = require('moment');

var config = require('config');
var r = require('../db');

var T = new Twit(config.get('twitter'));

r.promise.then((r) => {
  return r
    .table('tweets')
    .max({ index: 'created_at' })
    .run(r.conn)
    .catch((err) => {
      return undefined;
    })
    .then((initialSinceId) => {
      var trainNotice = new RegExp(/late|holding|departing/);
      var sinceId = initialSinceId.id;
      var getTweets = () => {
        T.get('statuses/user_timeline', {
          screen_name: 'caltrain_news',
          count: 30,
          exclude_replies: true,
          contributor_details: false,
          include_rts: false,
          since_id: sinceId
        }, function (err, response) {
          if (err) console.log('err', err);
          if (!Array.isArray(response)) return;

          response = _.filter(response, (row) => {
            return row.id !== sinceId;
          });

          if (response.length <= 0) return;

          sinceId = response[0].id;
          var inserts = _.map(response, function (row, i) {
            return {
              id: row.id,
              created_at: r.ISO8601(
                moment(new Date(row.created_at)).toISOString()
              ),
              truncated: row.truncated,
              text: row.text,
              hashtags: _.pluck(row.entities.hashtags, 'text')
            };
          });
          r
            .table('tweets')
            .insert(inserts)
            .run(r.conn)
            .then(function () {
              console.log(moment().toISOString(), ' - ' ,response.length, sinceId);
            });
        });
      };
      getTweets();
      setInterval(getTweets, 1000 * 60); // Every minute
    });
});
