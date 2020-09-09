import React from 'react';

const ResultsListItem = (props) => {
    return (
        <li onClick={props.onClick}>{props.value}</li>
    );
}

export default ResultsListItem;