import React, { Component } from 'react';
import './App.css';
import History from './History.js';
import Search from './Search.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
    };
  }

  deleteRow(i) {
    let history = this.state.history;
    history.splice(i,1);
    this.setState({
      history: history,
    });
  }

  clearHistory() { 
    this.setState({
      history: [],
    });
  }

  // Push query to history with timestamp
  saveSearch(query) {
    let history = this.state.history;

    history.push({
      title: query,
      timestamp: + new Date(),
    });

    this.setState({
      history: history,
    });
  }

  render() {
    const history = this.state.history;

    return (
      <div className="Wrapper">
        <main className="SearchBox">
          <h1>Search for a country</h1>
          <Search 
            saveSearch={(e) => this.saveSearch(e)}/>
          { history.length > 0 && 
          <History
            history={this.state.history}
            deleteRow={i => this.deleteRow(i)}
            clearHistory={() => this.clearHistory()}/>
          }
        </main>
      </div>
    );
  }
}

export default App;
