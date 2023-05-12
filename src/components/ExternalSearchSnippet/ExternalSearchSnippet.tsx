import React from 'react';
import './ExternalSearchSnippet.css';

import type { externalLink } from '../../interface/searchResults';

export function ExternalSearchSnippet (props: {
  className?: string,
  result: externalLink,
  handleClick?: (url: string) => void,
}): JSX.Element {
  const {
    className = '',
    result,
    handleClick
  } = props;

  return (
    <div className={`ExternalSearchSnippet ${className}`} onClick={() => { handleClick?.(result.url) }}>
      <div className="ExternalSearchSnippet-icon" />
      <div className="ExternalSearchSnippet-title">{result.name}</div>
      <div>{result.description}</div>
      <div>{result.url}</div>
    </div>
  )
}
