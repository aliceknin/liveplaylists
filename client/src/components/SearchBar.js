import React from 'react';

const SearchBar = (props) => {
    return (
        <form onSubmit={props.onSearch}>
            <label>Search for a City</label>
            <div className="search-bar">
                <input type="text" 
                    // placeholder="Search for a city"
                    value={props.value}
                    onChange={props.onChange}></input>
                <button type="submit">
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </form>
    );
}


export default SearchBar;