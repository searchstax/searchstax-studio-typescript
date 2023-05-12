import React from 'react';
import './SearchSnippet.css';

import type { foundDocument } from '../../interface/searchResults';

export function SearchSnippet (props: {
  position?: number,
  className?: string,
  result: foundDocument,
  handleClick?: (url: string, title: string, position: number) => void,
}): JSX.Element {
  const {
    position = -1,
    className = '',
    result,
    handleClick
  } = props;

  return (
    <div className={`SearchSnippet ${className}`} onClick={() => handleClick?.(result.url, result.title[0], position)} >
      <div className="SearchSnippet-badge">{result.content_type[0]}</div>
      {result['[elevated]'] && (<div className="SearchSnippet-featured" />)}
      <div className="SearchSnippet-content">
        <div className="SearchSnippet-title">{result?.title[0]}</div>
        <div className="SearchSnippet-link">{result?.paths[0]}</div>
        <div className="SearchSnippet-date">
          {result?.date !== undefined &&
            new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: '2-digit'
            }).format(new Date(result.date))
          }
        </div>
        <div className="SearchSnippet-author">{result?.author_name}</div>
        <div className="SearchSnippet-description">
          {result?.meta_image !== undefined && result?.meta_image !== '' && (
            <div className="SearchSnippet-image">
              <img src={result.meta_image} />
            </div>
          )}
          {result?.meta_description !== undefined
            ? (
                result.meta_description[0]
              )
            : (
              <>No description available</>
              )
          }
        </div>
      </div>
    </div>
  )
}
