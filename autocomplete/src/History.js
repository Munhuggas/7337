import React, { Component } from 'react';
import './App.css';

/*
 *  Search History component.
 *  Contains previous searches which may be
 *  1. Deleted row by row.
 *  2. Cleared completely.
 */

// A row in the history list
function HistoryRow(props) {
    // Format timestamp to "YYYY-DD-MM HH:MM AM/PM"
    const options = { hour12: true, year: 'numeric', month: '2-digit', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    const timestamp = new Date(props.timestamp).toLocaleDateString('eu-EU', options);
  
    return (
      <article 
        className="HistoryRow">
        <h1 className="HistoryRow-Title">{props.title}</h1>
        <span className="HistoryRow-Date">{timestamp}</span>
        <button
          type="button"
          className="HistoryRow-Delete" 
          aria-label="Delete row"
          onClick={props.onClick}>
        </button>
      </article>
    );
  }
  
  export default class History extends Component {
    constructor(props) {
      super(props);
      this.handleDelete = this.handleDelete.bind(this);
      this.handleClear = this.handleClear.bind(this);
    }
  
    handleDelete(index) {
      this.props.deleteRow(index);
    }
  
    handleClear() {
      this.props.clearHistory();
    }
  
    render() {
      const entries = this.props.history;
  
      return (
        <section className="History">
          <header className="History-Header">
            <h1 className="H2">Search history</h1>
            <button className="History-ClearButton" 
              onClick={this.handleClear}>Clear search history</button>
          </header>
          { entries.map((entry, index) => 
              <HistoryRow
                key={index}
                title={entry.title}
                timestamp={entry.timestamp}
                onClick={this.handleDelete}
              />
          )}
        </section>
      );
    }
  }
