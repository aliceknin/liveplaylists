import React from 'react';

const SearchBar = (props) => {
    return (
        <form onSubmit={props.onSearch}>
            <label>Search for a City</label>
            <div className="search-bar">
                <input type="text" 
                    value={props.value}
                    onChange={props.onChange}></input>
                <input type="submit"></input>
            </div>
        </form>
    );
}


export default SearchBar;