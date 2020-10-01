import React from 'react';
import { locationDisplayName } from '../utils/LocationUtils';

const ResultsListItem = (props) => {
    return (
        <li value={props.location.metroArea.id}>
            {locationDisplayName(props.location)}
        </li>
    );
}

export default ResultsListItem;