import React, { useEffect, useState } from 'react';
import './PopularSearches.css';

import { popular } from '../../api/popular';

import type { popularResult } from '../../interface/popularResults';

export function PopularSearches (props: {
  className?: string,
  newSearchCallback?: (searchString: string) => void,
  language?: string,
}): JSX.Element {
  const {
    className,
    newSearchCallback,
    language
  } = props;
  const [popularResults, setPopularSearches] = useState<popularResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getPopularSearches();
  }, []);

  const getPopularSearches = (): void => {
    setLoading(true);
    void popular(language).then(data => {
      setPopularSearches(data.response.docs);
      setLoading(false);
    });
  }

  return (
    <div className={className}>
      {loading
        ? (
            <div className="PopularSearches-loading" />
          )
        : (
            popularResults.length > 0
              ? (
                <>
                  Popular searches:
                  {popularResults.map((result, index) => (
                    <span key={index}>
                      <div
                        className="PopularSearches-link"
                        onClick={() => { newSearchCallback?.(result.query) }}
                      >
                        {result.query}
                        <div className="PopularSearches-link-count">
                          {result.count}
                        </div>
                      </div>
                    </span>
                  ))}
                </>
                )
              : ('')
          )
        }
    </div>
  )
}
