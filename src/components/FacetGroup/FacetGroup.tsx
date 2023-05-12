import React, { useState } from 'react';
import './FacetGroup.css';

import type { facet, facetField, facetFilter } from '../../interface/searchResults';

export function FacetGroup (props: {
  className?: string,
  facet: facet,
  filters?: facetFilter[],
  handleChange?: (filterValue: facetFilter[]) => void,
}): JSX.Element {
  const {
    className = '',
    facet,
    filters,
    handleChange
  } = props;
  const [selectedItems, setSelectedItems] = useState<string[]>(
    filters?.find((filter: facetFilter) => filter.name === facet.name)?.filter ?? []
  );

  const toggleFacet = (facetTitle: string): void => {
    let updatedFilter: string[] = [];
    if (facetTitle !== '') {
      if (selectedItems.includes(facetTitle)) {
        updatedFilter = selectedItems.filter(item => item !== facetTitle);
      } else {
        updatedFilter = [...selectedItems, facetTitle];
      }
    }
    setSelectedItems(updatedFilter);
    if (filters !== undefined) {
      let updatedFacets: facetFilter[] = filters;
      if (filters.find((filter: facetFilter) => filter.name === facet.name) !== undefined) {
        updatedFacets = filters.map((filter: facetFilter) => {
          if (filter.name === facet.name) {
            return {
              name: filter.name,
              filter: updatedFilter
            }
          } else {
            return filter;
          }
        });
      } else {
        updatedFacets = [...filters, { name: facet.name, filter: updatedFilter }];
      }
      handleChange?.(updatedFacets);
    }
  }

  return (
    (facet.fields.length > 0
      ? (
        <div className={`FacetGroup ${className}`}>
          <div className="FacetGroup-title">{facet.label}</div>
          {facet.fields.map((field: facetField, index) => (
            <div
              className={selectedItems.includes(field.title) ? 'FacetGroup-facet-selected' : 'FacetGroup-facet'}
              key={index}
              onClick={() => { toggleFacet(field.title) }}
            >
              {field.title}
              <div className="FacetGroup-facetCount">
                {field.count}
              </div>
            </div>
          ))}
        </div>
        )
      : <></>
    )
  )
}
