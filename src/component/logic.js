import SpotifyWebApi from './spotify-web-api.js';

export function getToken() {
 const hash = window.location.hash
      .substring(1)                             
      .split('&')                               
      .reduce(function (initial, item) {        
          if (item) {                           
              var parts = item.split('=');      
              initial[parts[0]] = decodeURIComponent(parts[1]);
          }               
          return initial; }, {});               
    return hash.access_token;
}

export async function isLoggedIn() {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

    return await spotifyApi.getMySavedTracks({limit: 1}).then(function(response) {
        console.log(response);
        return true;
    }).catch(function() {
        console.log("erred logging in");
        return false;
    });
}

async function getUserSavedTracksPromises() {
    
    var promise_list = [];

    function appendPromiseToList(promise) {
       promise_list.push(promise); 
    }

    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());
    var list_of_songs = [];

    var test_track = await spotifyApi.getMySavedTracks({limit : 1});

    if(test_track !== undefined) { // Spotify api is working
        const total_tracks  = test_track.total;
        const rounded_total = Math.floor(test_track.total / 50) * 50;
        for(var i=0; i < rounded_total; i += 50) {
            var prom = spotifyApi.getMySavedTracks({limit: 50, offset: i});
            appendPromiseToList(prom);
        }
    }

    return Promise.all(promise_list);
}

export function getArtistGenre(artist_id) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

}

export async function getGenreAnalysisOfTracks() {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

    var artist_array = [];
    var artist_id_set = new Set([]);
    var track_list = JSON.parse(localStorage.getItem("saved_track_list"));

    function appendToAlbumList(album_obj) {
        if(artist_id_set.has(album_obj.artist_id)) {
            return;
        } else {
            artist_id_set.add(album_obj.artist_id);
            artist_array.push(album_obj);
            return;
        }
    };

    track_list.forEach((track) => {
        appendToAlbumList({album_id: track.album,
                           added_on: track.time,
                           artist_id: track.artist})});

    //console.log(artist_array);

    var split_artist_array = [];

    // Cut the big list of artists into arrays of size 20
    for(var i=0; i < artist_array.length; i += 50) {
        var sliced = artist_array.slice(i, i+50);
        split_artist_array.push(sliced);
    }

    //console.log(split_artist_array);

    var artist_genre_map = new Map();

    async function asyncForEach(array, callback) {
        for( let index=0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async function fillMap(arr) {
        var just_artists = [];
        arr.forEach((album_obj) => {
            just_artists.push(album_obj.artist_id);
        });

        var resolved = await spotifyApi.getArtists(just_artists);
       // console.log(resolved);

        await asyncForEach(resolved.artists, async (artist) => {
            artist_genre_map.set(artist.id, artist.genres);
        });

    };

    for(let i=0; i < split_artist_array.length; i++) {
        await fillMap(split_artist_array[i]);
    }

   // console.log("map");

    console.log(artist_genre_map);
    //return artist_genre_map;
    for(let i=0; i < track_list.length; i++) {
        var current_data = track_list[i];
        current_data.genres = artist_genre_map.get(current_data.artist);
    }

    console.log(track_list);
    localStorage.setItem("saved_track_list", JSON.stringify(track_list));
}

export function getGenreAnalysisOfTracksOld() {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

    var track_list = JSON.parse(localStorage.getItem("saved_track_list"));
    console.log(track_list);
    var promise_list = [];
    function appendPromiseToList(prom) {
        promise_list.push(prom);
    }
    track_list.forEach((track) => {
        appendPromiseToList(
            getAlbumGenre(track.album)
        );
    });
    console.log(promise_list);

}

export function getAlbumGenrePromise(album_id) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

    var resp = spotifyApi.getAlbum(album_id);
    return resp;
}

export function getAlbumGenre(album_id) {
    var spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(getToken());

    var resp = spotifyApi.getAlbum(album_id);
    return resp.then(function(response) {
        return response.genres;
    }).catch(function(err) {
        return [];
    });
}

export async function getMonthsTrackMap() {
    let tracks = JSON.parse(localStorage.getItem("saved_track_list"));
    var year_map = new Map();
    function insertToYearMap(track) {
        var year  = track.time.slice(0,4);
        var month = track.time.slice(5,7);
        if(!year_map.has(year)) {
            year_map.set(year, new Map());
        }
        var track_year_map = year_map.get(year);
        if(!track_year_map.has(month)) {
            track_year_map.set(month, new Map());
        }
        

    };
    tracks.forEach((track) => {
        insertToYearMap(track);
    });
    console.log(year_map);
}

export async function getUserSavedTracks() {
    var count = 0;
    function getCount() {
        count += 1;
        return count;
    }
    return await getUserSavedTracksPromises().then(function(responses) {
        var track_list = [];
        responses.forEach((response) => {
            response.items.forEach((track) => {
                track_list.push({key: getCount(),
                                 id : track.track.id, 
                                 time: track.added_at,
                                 artist: track.track.artists[0].id,
                                 album: track.track.album.id});
            });
        });
        localStorage.setItem("saved_track_list", JSON.stringify(track_list));
        return track_list;
    }).catch(function(err) {
        console.log(err);
        return ":(";
    });
}

export async function getTopArtists() {
    var token = getToken();
    //alert(token);
    var spotifyApi = new SpotifyWebApi();        
    spotifyApi.setAccessToken(token);         

    var resp = await spotifyApi.getMyTopArtists({limit: 50, time_range: 'long_term'});
    localStorage.setItem("top_artists_long_term", JSON.stringify(resp));

    resp = await spotifyApi.getMyTopArtists({limit: 50, time_range: 'medium_term'});
    localStorage.setItem("top_artists_medium_term", JSON.stringify(resp));
    return; 
}

                       
//export default updateLocalStorage;
