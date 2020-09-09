import React from 'react';

const ResultsList = (props) => {
    function locationDisplayName(location) {
        const city = location.city.displayName;
        const locale = location.city.state || location.city.country;
        return city + ", " + locale.displayName;
    }

    function getKey(location) {
        return location.city.displayName + location.metroArea.id.toString();
    }

    return (
        props.show &&
        <ul className="results-list"
            onClick={props.onClick}>
            {props.locations.map((location) => 
            <li key={getKey(location)}
                value={location.metroArea.id}>
                {locationDisplayName(location)}
            </li>)}
            {props.shouldShowMore && 
            <li onClick={props.showMore}
                className="show-more">Show More</li>}
        </ul>
    );
}

export default ResultsList;