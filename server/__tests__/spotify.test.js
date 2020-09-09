const { UserSpotifyAPI } = require('../config/spotify');

let userSpotifyAPI;

beforeEach(() => {
    userSpotifyAPI = new UserSpotifyAPI();
});

test('should have the client credentials', () => {
    expect(userSpotifyAPI.getClientId())
        .toBe(process.env.SPOTIFY_CLIENT_ID);
    expect(userSpotifyAPI.getClientSecret())
        .toBe(process.env.SPOTIFY_CLIENT_SECRET);
});