import React from 'react';

const SearchBar = (props) => {
    return (
        <form onSubmit={props.onSearch}>
            <div className="search-bar">
                <input type="text"
                    required
                    aria-label="Search for a city" 
                    placeholder="Search for a city"
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