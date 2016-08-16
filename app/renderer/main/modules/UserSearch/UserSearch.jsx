import React from 'react';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlight from 'autosuggest-highlight';

import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import 'app/renderer/assets/css/autosuggest.css';

export default React.createClass({
  onChange(event, { newValue }) {
    this.props.UserSearchActions.updateInputValue(newValue)
    const value = newValue.trim();
    if (value === '') {
      this.props.UserSearchActions.clearSuggestions();
    }
  },

  onSuggestionsUpdateRequested({ value }) {
    this.props.UserSearchActions.loadSuggestions(value);
  },

  getSuggestionValue(suggestion) {
    return suggestion.name;
  },

  renderSuggestion(suggestion, {query}) {
//    return (
//      <div className="layout-row layout-align-start-center">
//        <UserAvatar picture={suggestion.picture}/>
//        <div style={{marginLeft: '15px'}} className="flex">{suggestion.name}</div>
//      </div>
//    );
  const suggestionText = suggestion.name;
  const matches = AutosuggestHighlight.match(suggestionText, query);
  const parts = AutosuggestHighlight.parse(suggestionText, matches);

  return (
    <div className="layout-row layout-align-start-center">
      <UserAvatar picture={suggestion.picture}/>
      <div style={{marginLeft: '10px'}} className="flex">
      {
        parts.map((part, index) => {
          const className = part.highlight ? 'highlight' : null;
          return (
            <span className={className} key={index}>{part.text}</span>
          );
        })
      }
      </div>
    </div>

  );

  },

  onSuggestionSelected(event, { suggestion, suggestionValue, sectionIndex, method }){
    this.props.UserSearchActions.selectSuggestion(suggestion)
  },

  render() {
    const inputProps = {
      placeholder: "Search for User",
      value: this.props.userSearch.value,
      onChange: this.onChange
    };

    return (
      <div className="app-container">
        <Autosuggest
          suggestions={this.props.userSearch.suggestions}
          onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
          getSuggestionValue={this.getSuggestionValue}
          onSuggestionSelected={this.onSuggestionSelected}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
})
