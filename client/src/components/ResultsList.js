import React from 'react';
import ResultsListItem from './ResultsListItem';

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
        props.show() &&
        <ul className="results-list">
            {props.locations.map((location) => 
            <ResultsListItem 
                key={getKey(location)} 
                value={locationDisplayName(location)}
                onClick={props.onClick}/>)}
        </ul>
    );
}

export default ResultsList;