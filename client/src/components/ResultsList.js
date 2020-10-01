import React from 'react';
import ResultsListItem from './ResultsListItem';

const ResultsList = (props) => {

    function getKey(location) {
        return location.city.displayName + location.metroArea.id.toString();
    }

    return (
        props.show &&
        ((props.locations.length > 0) ?
        <ul className="results-list"
            onClick={props.onClick}>
            {props.locations.map((location) => 
            <ResultsListItem key={getKey(location)}
                             location={location}/>)}
            {props.shouldShowMore && 
            <li onClick={props.showMore}
                className="show-more"
                key="showMore">Show More</li>}
        </ul>
        : 
        <div className="no-results">
            We couldn't find anything for "{props.query}".<br/>
            Try a new search?
        </div>)
    );
}

export default ResultsList;