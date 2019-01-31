import React, { Component } from 'react';
import './App.css';

/*
 *  Search function.
 *  Contains a search field and a suggestions selectbox.
 */

// The search input with a clear button
function SearchField(props) {
  return (
    <div className="SearchField">
      <input type="text" placeholder="Search ..." 
        className="SearchField-Input" value={props.value}
        onChange={props.onChange}></input>
      <button type="button" className="SearchField-Clear" tabIndex="-1"
        aria-label="Clear search field" onClick={props.onClick}></button>
    </div>
  );
}

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  // Format list to highlight the query word
  highlightactiveQuery(query) {
    const indexOfactiveQuery = query.indexOf(this.props.suggestionQuery);

    // Sanity check for weird suggestion without query inside.
    if(indexOfactiveQuery < 0) {
      return query;
    }

    const beforeactiveQuery = query.substring(0, indexOfactiveQuery);
    const afteractiveQuery = query.substring(indexOfactiveQuery + this.props.suggestionQuery.length);

    return (
      <React.Fragment>
        {beforeactiveQuery}<strong>
          {indexOfactiveQuery > -1 ? this.props.suggestionQuery : ""}
        </strong>{afteractiveQuery}
      </React.Fragment>
    );
  }

  // OnClick submit directly for better UX
  onClick(event, query) {
    this.props.onSubmit(event, query);
  }

  render() {
    return (
      <ul className="Suggestions">
        { this.props.suggestions.map((suggestion, index) => 
          <li 
            key={suggestion.name}
            className={"Suggestions-Option " + (index === this.props.activeIndex ? "Suggestions-Option_Active" : "")}
            onClick={(event) => this.onClick(event, suggestion.name)}>
              {this.highlightactiveQuery(suggestion.name.toLowerCase())}
          </li>
        )}
      </ul>
    );
  }
}

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      suggestions: [],
      cache: {},
      activeQuery: '',
      suggestionQuery: '',
      activeIndex: -1,
    }
    this.clearSearch = this.clearSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSuggestions = this.handleSuggestions.bind(this);
    this.fetchSuggestions = this.fetchSuggestions.bind(this);
  }

  clearSearch() {
    this.setState({
      activeQuery: '',
      suggestionQuery: '',
      suggestions: [],
    });
  }

  // Update which suggestion is active and set it as active query
  handleSuggestions(event) {
    const activeIndex = this.state.activeIndex;
    const maxIndex = this.state.suggestions.length - 1;
    
    // If suggestion list is empty, don't try to select items
    if(maxIndex < 0) {      
      return;
    }

    // On arrow up, select the item above if it exists
    if(event.keyCode === 38) {
      const newIndex = activeIndex > 0 ? activeIndex - 1 : 0;
      this.setState({
        activeIndex: newIndex,
        activeQuery: this.state.suggestions[newIndex].name,
      })
    }

    // On arrow down, select the item below if it exists
    if(event.keyCode === 40) {
      const newIndex = activeIndex < maxIndex ? activeIndex + 1 : maxIndex;
      this.setState({
        activeIndex: newIndex,
        activeQuery: this.state.suggestions[newIndex].name,
      })
    }
  }

  // Fetch suggestions from cache or REST api on cache miss.
  fetchSuggestions(event) {
    const activeQuery = event.target.value;

    this.setState({
      activeQuery: activeQuery,
      suggestionQuery: activeQuery,
      activeIndex: -1,
    });

    // Don't do anything if the query is empty.
    if(!activeQuery.length > 0) {
      this.setState({
        suggestions: [],
      });
      return;
    }
    const res = this.fetchFromCache(activeQuery);

    if(!res) {
      this.fetchFromRest(activeQuery);
    }
  }

  fetchFromCache(activeQuery) {
    const res = this.state.cache[activeQuery];

    if(res) {
      this.setState({
        suggestions: res,
      })
    }

    return res;
  }

  fetchFromRest(query) {
    fetch("https://restcountries.eu/rest/v2/name/" + query + "?fields=name")
    .then(res => res.json())
    .then(
      (result) => {
        let cache = this.state.cache;
        cache[query] = result;

        this.setState({
          suggestions: result,
          cache: cache,
        });
      },
      (error) => {
        this.setState({
          error
        });
      }
    )
  }

  // On submit, save query to history.
  handleSubmit(event, activeQuery) {
    this.props.saveSearch(activeQuery);
    this.setState({
      activeQuery: '',
      suggestions: [],
    })
    event.preventDefault();
  }

  render() {
    return (
      <form className="Search"
        onSubmit={(event) => this.handleSubmit(event, this.state.activeQuery)}
        onKeyDown={this.handleSuggestions}>
        <SearchField 
          value={this.state.activeQuery}
          onChange={this.fetchSuggestions}
          onClick={this.clearSearch} />
        { this.state.suggestions.length > 0 &&
        <Suggestions 
          activeIndex={this.state.activeIndex}
          suggestionQuery={this.state.suggestionQuery}
          suggestions={this.state.suggestions}
          onSubmit={this.handleSubmit} />
        }
      </form>
    );
  }
}