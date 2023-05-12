import React, { useState } from 'react';
import './FacetMenu.css';

import type { facet, facetField, facetFilter } from '../../interface/searchResults';

export function FacetMenu (props: {
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
  const [collapsed, setCollapsed] = useState<boolean>(true);

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

  const clearFacets = (): void => {
    if (filters !== undefined) {
      let updatedFacets: facetFilter[] = [];
      if (filters.find((filter: facetFilter) => filter.name === facet.name) !== undefined) {
        updatedFacets = filters.map((filter: facetFilter) => {
          if (filter.name === facet.name) {
            return {
              name: filter.name,
              filter: []
            }
          } else {
            return filter;
          }
        });
      } else {
        updatedFacets = [...filters, { name: facet.name, filter: [] }];
      }
      handleChange?.(updatedFacets);
      setSelectedItems([]);
    }
  }

  return (
    (facet.fields.length > 0
      ? (
        <div className={`FacetMenu ${className}`}>
          <div className="FacetMenu-title" onClick={() => { setCollapsed(!collapsed) }}>
            {facet.label}
            <button className={collapsed ? 'FacetMenu-show' : 'FacetMenu-hidden'} />
          </div>
          {!collapsed
            ? (
                <div className="FacetMenu-menu">
                  <button className="FacetMenu-clear" onClick={clearFacets}>Clear</button>
                  {facet.fields.map((field: facetField, index) => (
                  <label className="FacetMenu-facet" key={index}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(field.title)}
                      onClick={() => { toggleFacet(field.title) }}
                    />
                    {field.title} ({field.count})
                  </label>
                  ))}
                </div>
              )
            : ('')
            }
        </div>
        )
      : <span />
    )
  )
}
