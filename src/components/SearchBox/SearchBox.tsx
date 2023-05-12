import React, { useEffect, useState } from 'react';
import './SearchBox.css';

import { suggest } from '../../api/suggest';

import type { suggestion } from '../../interface/suggestResults';

// Timer to debounce autosuggest results
let debounce = setTimeout(() => {}, 0);

export function SearchBox (props: {
  className?: string,
  searchQuery?: string,
  submitCallback?: (searchString: string) => void,
  searchLoading?: boolean,
  language?: string,
}): JSX.Element {
  const {
    className = '',
    searchQuery = '',
    submitCallback,
    searchLoading,
    language
  } = props;
  const [searchString, setSearchString] = useState<string>('');
  const [suggestedTerms, setSuggestedTerms] = useState<suggestion[]>([]);
  const [clearable, setClearable] = useState<boolean>(false);

  // Update internal searchString for controlled input when search result page changes query
  useEffect(() => {
    setSearchString(searchQuery);
  }, [searchQuery]);

  // Get suggestions when user starts typing search query
  const handleChange = (search: string): void => {
    setClearable(search === searchQuery);
    setSearchString(search);
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      if (search !== '' && search.length > 2) {
        void suggest(
          search,
          language
        ).then(data => {
          if (data.suggest !== undefined) {
            setSuggestedTerms(data.suggest.studio_suggestor_en[search].suggestions);
          } else {
            setSuggestedTerms([]);
          }
        });
      } else {
        setSuggestedTerms([]);
      }
    }, 250);
  };

  // Handle form submit and button click events
  const handleSubmit = (): void => {
    if (searchQuery !== searchString) {
      setSuggestedTerms([]);
      submitCallback?.(searchString);
      setClearable(true);
    } else {
      if (clearable) {
        setSearchString('');
      }
    }
  }

  // Click handler for suggested results dropdown
  const selectSuggestion = (suggestedSearch: string): void => {
    setSearchString(suggestedSearch);
    setSuggestedTerms([]);
    submitCallback?.(suggestedSearch);
  };

  return (
    <div className={className}>
      <form
        className="SearchBox"
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className="SearchBox-query"
          type="search"
          value={searchString}
          onChange={(event) => { handleChange(event.target.value) }}
        />
        <button
          className={searchLoading === true
            ? 'SearchBox-submit-loading'
            : searchQuery !== null && searchQuery === searchString && searchString !== ''
              ? 'SearchBox-submit-clear'
              : 'SearchBox-submit' }
          onClick={handleSubmit}
          disabled={searchString.length === 0 || searchLoading}
        />
        <div className="SearchBox-suggestion">
          {suggestedTerms?.map((result, index) => (
            <div
              key={index}
              className="SearchBox-suggestion-item"
              onClick={() => { selectSuggestion(result.term.replace(/<[^>]+>/g, '')) }}
            >
              {result.term.replace(/<[^>]+>/g, '')}
            </div>
          ))}
        </div>
      </form>
    </div>
  )
}
