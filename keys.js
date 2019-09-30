console.log('this is loaded');

module.exports.omdb = {
  id: process.env.OMDB_KEY,
};

module.exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};