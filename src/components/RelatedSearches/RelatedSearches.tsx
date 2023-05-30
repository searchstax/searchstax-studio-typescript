import React, { useEffect, useState } from 'react';
import './RelatedSearches.css';

import { related } from '../../api/related';

import type { relatedResult } from '../../interface/relatedResults';

export function RelatedSearches (props: {
  className?: string,
  searchQuery?: string,
  newSearchCallback?: (searchString: string, sort: string, searchType: string) => void,
  language?: string,
}): JSX.Element {
  const {
    className,
    searchQuery = '',
    newSearchCallback,
    language
  } = props;
  const [searchString, setSearchString] = useState('');
  const [relatedSearches, setRelatedSearches] = useState<relatedResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (searchQuery !== searchString && searchQuery !== '') {
      getRelatedSearches(searchQuery);
      setSearchString(searchQuery);
    }
  }, [searchQuery]);

  const getRelatedSearches = (searchString: string): void => {
    setLoading(true);
    void related(
      searchString,
      language
    ).then(data => {
      setRelatedSearches(data.response.docs);
      setLoading(false);
    });
  }

  return (
    <div className={className}>
      {loading
        ? (
            <div className="RelatedSearches-loading" />
          )
        : (
            searchString !== '' && relatedSearches.length > 0
              ? (
                <>
                  Related searches:
                  {relatedSearches.map((result, index) => (
                    <span key={index}>
                      {index > 0 ? ', ' : ''}
                      <div
                        className="RelatedSearches-link"
                        onClick={() => { newSearchCallback?.(result.related_search, '', '_relatedsearch') }}
                      >
                        {result.related_search}
                      </div>
                    </span>
                  ))}
                </>
                )
              : ''
          )
        }
    </div>
  )
}
