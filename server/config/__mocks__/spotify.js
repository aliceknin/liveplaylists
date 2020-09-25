
const MockUserSpotifyAPI = jest.fn(() => {
    return {
        setRefreshTokenAndReturn: mockSetRefreshTokenAndReturn,
        ensureAccessToken: mockEnsureAccessToken,
        searchArtists: mockSearchArtists,
        getArtistTopTracks: mockGetArtistTopTracks,
        createPlaylist: mockCreatePlaylist,
        followPlaylist: mockFollowPlaylist,
        changePlaylistDetails: mockChangePlaylistDetails,
        replaceTracksInPlaylist: mockReplaceTracksInPlaylist,
        addTracksToPlaylist: mockAddTracksToPlaylist,
        getPlaylist: mockGetPlaylist
    }
});

const mockSetRefreshTokenAndReturn = jest.fn(function() {
    return this;
});

const mockEnsureAccessToken = jest.fn(function(funcName, args) {
    return this[funcName](...args);
});

const mockSearchArtists = jest.fn();
const mockGetArtistTopTracks = jest.fn();
const mockCreatePlaylist = jest.fn();
const mockFollowPlaylist = jest.fn();
const mockChangePlaylistDetails = jest.fn();
const mockReplaceTracksInPlaylist = jest.fn();
const mockAddTracksToPlaylist = jest.fn();
const mockGetPlaylist = jest.fn();

MockUserSpotifyAPI.mockSetRefreshTokenAndReturn = mockSetRefreshTokenAndReturn;
MockUserSpotifyAPI.mockEnsureAccessToken = mockEnsureAccessToken;
MockUserSpotifyAPI.mockSearchArtists = mockSearchArtists;
MockUserSpotifyAPI.mockGetArtistTopTracks = mockGetArtistTopTracks
MockUserSpotifyAPI.mockCreatePlaylist = mockCreatePlaylist;
MockUserSpotifyAPI.mockFollowPlaylist = mockFollowPlaylist;
MockUserSpotifyAPI.mockChangePlaylistDetails = mockChangePlaylistDetails;
MockUserSpotifyAPI.mockReplaceTracksInPlaylist = mockReplaceTracksInPlaylist;
MockUserSpotifyAPI.mockAddTracksToPlaylist = mockAddTracksToPlaylist;
MockUserSpotifyAPI.mockGetPlaylist = mockGetPlaylist;

module.exports = MockUserSpotifyAPI;