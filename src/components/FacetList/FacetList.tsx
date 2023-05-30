import React, { useState } from 'react';
import './FacetList.css';

import type { facet, facetField, facetFilter } from '../../interface/searchResults';

export function FacetList (props: {
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
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);

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
        <div className={`FacetList ${className}`}>
          <div className="FacetList-title">
            {facet.label}
            <button className={collapsed ? 'FacetList-hidden' : 'FacetList-show'} onClick={() => { setCollapsed(!collapsed) }} />
          </div>
          {!collapsed
            ? (
                showAll
                  ? (
                      facet.fields.map((field: facetField, index) => (
                      <label className="FacetList-facet" key={index}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(field.title)}
                          onClick={() => { toggleFacet(field.title) }}
                          readOnly
                        />
                        {field.title} ({field.count})
                      </label>
                      ))
                    )
                  : (
                    <div>
                      {facet.fields.slice(0, 3).map((field: facetField, index) => (
                        <label className="FacetList-facet" key={index}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(field.title)}
                            onClick={() => { toggleFacet(field.title) }}
                            readOnly
                          />
                          {field.title} ({field.count})
                        </label>
                      ))}
                      {facet.fields.length > 3
                        ? <button className="FacetList-expand" onClick={() => { setShowAll(true) }}>More</button>
                        : ''
                      }
                    </div>
                    )
              )
            : ('')
            }
        </div>
        )
      : <span />
    )
  )
}
