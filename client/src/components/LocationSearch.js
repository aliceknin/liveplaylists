import React, { useState } from 'react';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';
import Axios from 'axios';
import UseMyLocation from './UseMyLocation';

const LocationSearch = (props) => {
    const [ query, setQuery ] = useState(props.location.displayName || "");
    const [ showResults, setShowResults ] = useState(false);
    const [ locations, setLocations ] = useState([]);
    const [ page, setPage ] = useState(1);
    const [ showMore, setShowMore ] = useState(false);

    function handleSearchChange(event) {
        setQuery(event.target.value);
        if (showResults) setShowResults(false);
    }

    async function handleSearchSubmit(event) {
        event.preventDefault();
        let resultsPage = await searchForLocation(query);
        setLocations(resultsPage.results.location ? 
                     resultsPage.results.location : []);
        receivedNewLocations(resultsPage);
    }

    function handleResultClick(event) {
        let location = event.target.textContent;
        setQuery(location);
        props.setLocation({
            displayName: location,
            metroID: event.target.value
        });
        setShowResults(false);
    }

    async function handleShowMore(event) {
        event.stopPropagation();
        let resultsPage = await searchForLocation(query, page + 1);
        setLocations(locations.concat(resultsPage.results.location));
        receivedNewLocations(resultsPage);
    }

    function recieveGeoLocation(location) {
        setQuery(location.displayName);
        props.setLocation(location);
    }

    async function searchForLocation(query, page) {
        try {
            let res = await Axios.get('/playlist/location', {
                params: {
                    query: query,
                    page: page || 1
                }
            });
            return res.data.resultsPage;
        } catch(err) {
            console.log("location search failed", err);
        }
    }

    function receivedNewLocations(resultsPage) {
        setPage(resultsPage.page);
        setShowResults(true);
        setShowMore(shouldShowMore(resultsPage));
    }

    function shouldShowMore(resultsPage) {
        let resultsShown = resultsPage.page * resultsPage.perPage;
        return resultsShown < resultsPage.totalEntries;
    }

    return (
        <div className="location-search">
            <SearchBar value={query} 
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}/>
            <ResultsList show={showResults}
                        query={query}
                        onClick={handleResultClick}
                        locations={locations}
                        shouldShowMore={showMore}
                        showMore={handleShowMore}/>
            <UseMyLocation recieveLocation={recieveGeoLocation}/>
        </div>
    );
}

export default LocationSearch;

// const resultsPage = {
//         "status": "ok",
//         "results": {
//             "location": [
//                 {
//                     "city": {
//                         "lat": 42.3216,
//                         "lng": -71.0891,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "state": {
//                             "displayName": "MA"
//                         },
//                         "displayName": "Boston"
//                     },
//                     "metroArea": {
//                         "lat": 42.336,
//                         "lng": -71.0179,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "uri": "http://www.songkick.com/metro_areas/18842-us-boston-cambridge?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "MA"
//                         },
//                         "displayName": "Boston / Cambridge",
//                         "id": 18842
//                     }
//                 },
//                 {
//                     "city": {
//                         "lat": 42.6289,
//                         "lng": -78.7378,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "state": {
//                             "displayName": "NY"
//                         },
//                         "displayName": "Boston"
//                     },
//                     "metroArea": {
//                         "lat": 42.9047,
//                         "lng": -78.8494,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "uri": "http://www.songkick.com/metro_areas/22996-us-buffalo?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "NY"
//                         },
//                         "displayName": "Buffalo",
//                         "id": 22996
//                     }
//                 },
//                 {
//                     "city": {
//                         "displayName": "Boston",
//                         "country": {
//                             "displayName": "UK"
//                         },
//                         "lat": null,
//                         "lng": null
//                     },
//                     "metroArea": {
//                         "displayName": "Peterborough",
//                         "country": {
//                             "displayName": "UK"
//                         },
//                         "lat": 52.5833,
//                         "lng": -0.25,
//                         "uri": "http://www.songkick.com/metro_areas/24617-uk-peterborough?utm_source=58576&utm_medium=partner",
//                         "id": 24617
//                     }
//                 },
//                 {
//                     "city": {
//                         "lat": 42.336,
//                         "lng": -71.0179,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "state": {
//                             "displayName": "MA"
//                         },
//                         "displayName": "Boston / Cambridge"
//                     },
//                     "metroArea": {
//                         "lat": 42.336,
//                         "lng": -71.0179,
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "uri": "http://www.songkick.com/metro_areas/18842-us-boston-cambridge?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "MA"
//                         },
//                         "displayName": "Boston / Cambridge",
//                         "id": 18842
//                     }
//                 },
//                 {
//                     "city": {
//                         "lat": 42.9761945,
//                         "lng": -71.6939626,
//                         "state": {
//                             "displayName": "NH"
//                         },
//                         "displayName": "New Boston",
//                         "country": {
//                             "displayName": "US"
//                         }
//                     },
//                     "metroArea": {
//                         "lat": 42.9863,
//                         "lng": -71.4516,
//                         "uri": "http://www.songkick.com/metro_areas/24591-us-manchester?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "NH"
//                         },
//                         "id": 24591,
//                         "displayName": "Manchester",
//                         "country": {
//                             "displayName": "US"
//                         }
//                     }
//                 },
//                 {
//                     "city": {
//                         "displayName": "Boston Creek",
//                         "country": {
//                             "displayName": "Canada"
//                         },
//                         "lat": 48,
//                         "lng": -79.9333,
//                         "state": {
//                             "displayName": "ON"
//                         }
//                     },
//                     "metroArea": {
//                         "displayName": "Sudbury",
//                         "country": {
//                             "displayName": "Canada"
//                         },
//                         "lat": 46.5,
//                         "lng": -80.9667,
//                         "uri": "http://www.songkick.com/metro_areas/27394-canada-sudbury?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "ON"
//                         },
//                         "id": 27394
//                     }
//                 },
//                 {
//                     "city": {
//                         "displayName": "South Boston",
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "lat": null,
//                         "lng": null,
//                         "state": {
//                             "displayName": "VA"
//                         }
//                     },
//                     "metroArea": {
//                         "displayName": "Danville",
//                         "country": {
//                             "displayName": "US"
//                         },
//                         "lat": 36.586,
//                         "lng": -79.4172,
//                         "uri": "http://www.songkick.com/metro_areas/56574-us-danville?utm_source=58576&utm_medium=partner",
//                         "state": {
//                             "displayName": "VA"
//                         },
//                         "id": 56574
//                     }
//                 }
//             ]
//         },
//         "perPage": 50,
//         "page": 1,
//         "totalEntries": 7
//     }