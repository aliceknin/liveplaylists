import React, { useState } from 'react';
import SearchBar from './SearchBar';
import ResultsList from './ResultsList';

const LocationSearch = (props) => {
    const [ query, setQuery ] = useState("");
    const [ showResults, setShowResults ] = useState(false);
    const [ locations, setLocations ] = useState([]);

    function handleSearchChange(event) {
        setQuery(event.target.value);
    }

    function handleSearchSubmit(event) {
        event.preventDefault();
        setLocations(resultsPage.results.location);
        setShowResults(true);
    }

    function shouldShowResults() {
        return showResults;
    }

    function handleResultClick(event) {
        setQuery(event.target.textContent);
        setShowResults(false);
    }

    return (
        <div className="location-search form-group">
            <SearchBar value={query} 
                    onChange={handleSearchChange}
                    onSearch={handleSearchSubmit}/>
            <ResultsList show={shouldShowResults}
                        onClick={handleResultClick}
                        locations={locations} />
        </div>
    );
}

export default LocationSearch;

const resultsPage= {
        "status": "ok",
        "results": {
            "location": [
                {
                    "city": {
                        "lat": 42.3216,
                        "lng": -71.0891,
                        "country": {
                            "displayName": "US"
                        },
                        "state": {
                            "displayName": "MA"
                        },
                        "displayName": "Boston"
                    },
                    "metroArea": {
                        "lat": 42.336,
                        "lng": -71.0179,
                        "country": {
                            "displayName": "US"
                        },
                        "uri": "http://www.songkick.com/metro_areas/18842-us-boston-cambridge?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "MA"
                        },
                        "displayName": "Boston / Cambridge",
                        "id": 18842
                    }
                },
                {
                    "city": {
                        "lat": 42.6289,
                        "lng": -78.7378,
                        "country": {
                            "displayName": "US"
                        },
                        "state": {
                            "displayName": "NY"
                        },
                        "displayName": "Boston"
                    },
                    "metroArea": {
                        "lat": 42.9047,
                        "lng": -78.8494,
                        "country": {
                            "displayName": "US"
                        },
                        "uri": "http://www.songkick.com/metro_areas/22996-us-buffalo?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "NY"
                        },
                        "displayName": "Buffalo",
                        "id": 22996
                    }
                },
                {
                    "city": {
                        "displayName": "Boston",
                        "country": {
                            "displayName": "UK"
                        },
                        "lat": null,
                        "lng": null
                    },
                    "metroArea": {
                        "displayName": "Peterborough",
                        "country": {
                            "displayName": "UK"
                        },
                        "lat": 52.5833,
                        "lng": -0.25,
                        "uri": "http://www.songkick.com/metro_areas/24617-uk-peterborough?utm_source=58576&utm_medium=partner",
                        "id": 24617
                    }
                },
                {
                    "city": {
                        "lat": 42.336,
                        "lng": -71.0179,
                        "country": {
                            "displayName": "US"
                        },
                        "state": {
                            "displayName": "MA"
                        },
                        "displayName": "Boston / Cambridge"
                    },
                    "metroArea": {
                        "lat": 42.336,
                        "lng": -71.0179,
                        "country": {
                            "displayName": "US"
                        },
                        "uri": "http://www.songkick.com/metro_areas/18842-us-boston-cambridge?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "MA"
                        },
                        "displayName": "Boston / Cambridge",
                        "id": 18842
                    }
                },
                {
                    "city": {
                        "lat": 42.9761945,
                        "lng": -71.6939626,
                        "state": {
                            "displayName": "NH"
                        },
                        "displayName": "New Boston",
                        "country": {
                            "displayName": "US"
                        }
                    },
                    "metroArea": {
                        "lat": 42.9863,
                        "lng": -71.4516,
                        "uri": "http://www.songkick.com/metro_areas/24591-us-manchester?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "NH"
                        },
                        "id": 24591,
                        "displayName": "Manchester",
                        "country": {
                            "displayName": "US"
                        }
                    }
                },
                {
                    "city": {
                        "displayName": "Boston Creek",
                        "country": {
                            "displayName": "Canada"
                        },
                        "lat": 48,
                        "lng": -79.9333,
                        "state": {
                            "displayName": "ON"
                        }
                    },
                    "metroArea": {
                        "displayName": "Sudbury",
                        "country": {
                            "displayName": "Canada"
                        },
                        "lat": 46.5,
                        "lng": -80.9667,
                        "uri": "http://www.songkick.com/metro_areas/27394-canada-sudbury?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "ON"
                        },
                        "id": 27394
                    }
                },
                {
                    "city": {
                        "displayName": "South Boston",
                        "country": {
                            "displayName": "US"
                        },
                        "lat": null,
                        "lng": null,
                        "state": {
                            "displayName": "VA"
                        }
                    },
                    "metroArea": {
                        "displayName": "Danville",
                        "country": {
                            "displayName": "US"
                        },
                        "lat": 36.586,
                        "lng": -79.4172,
                        "uri": "http://www.songkick.com/metro_areas/56574-us-danville?utm_source=58576&utm_medium=partner",
                        "state": {
                            "displayName": "VA"
                        },
                        "id": 56574
                    }
                }
            ]
        },
        "perPage": 50,
        "page": 1,
        "totalEntries": 7
    }