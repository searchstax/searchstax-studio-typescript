import React, { useEffect, useState, useRef } from 'react';
import './SearchResultPage.css';
import { ExternalSearchSnippet } from '../ExternalSearchSnippet/ExternalSearchSnippet';
import { FacetGroup } from '../FacetGroup/FacetGroup';
import { FacetList } from '../FacetList/FacetList';
import { FacetMenu } from '../FacetMenu/FacetMenu';
import { Feedback } from '../Feedback/Feedback';
import { RelatedSearches } from '../RelatedSearches/RelatedSearches';
import { PopularSearches } from '../PopularSearches/PopularSearches';
import { SearchBox } from '../SearchBox/SearchBox';
import { SearchSnippet } from '../SearchSnippet/SearchSnippet';

// SearchStax APIs
import { search } from '../../api/search';
import { trackEvent } from '../../api/reporting';

// Interfaces
import type { searchResultsPage, searchResult, facet, facetField, facetLabel, facetFilter, foundDocument } from '../../interface/searchResults';
import type { event } from '../../interface/report';
import type { selectOption } from '../../interface/select';

import ReactGA from 'react-ga4';

ReactGA.initialize(process.env.REACT_APP_GA_ID ?? '');

// Timer to debounce scroll events for infinite load
let debounce = setTimeout(() => {}, 0);

// Additional sort options are set in SearchStax Studio and included in API response
const defaultSort: selectOption[] = [{ value: '', label: 'Relevance' }];
const rowOptions: number[] = [10, 20, 30, 50];

export function SearchResultPage (props: {
  sessionId?: string,
  uuid?: string,
  language?: string,
}): JSX.Element {
  const {
    sessionId = '',
    uuid = '',
    language = 'en'
  } = props;
  const [searchResults, setSearchResults] = useState<searchResultsPage>();
  const [facetFilters, setFacetFilters] = useState<facetFilter[]>([]);
  const [start, setStart] = useState<number>(0);
  const [sort, setSort] = useState<string>('');
  const [spellcheck, setSpellcheck] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [sortOptions, setSortOptions] = useState<selectOption[]>(defaultSort);
  const scrollBottom = useRef(null);
  const [rows, setRows] = useState<number>(30); // Default results per page
  const [viewStyle, setViewStyle] = useState<string>('list'); // Results can be shown as a list or grid
  const loadOnScroll: boolean = true; // Set to 'true' for infinite scrolling
  const facetType: string = 'list' // Set to group (default), menu, or list

  // Track Intersection/Observability of scrollBottom component to trigger infinite loading/scrolling
  useEffect(() => {
    const scrollObserver = new IntersectionObserver(([entry]) => {
      if (loadOnScroll && entry.isIntersecting && searchResults !== undefined && searchResults.start < searchResults?.numFound && !loading) {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          updateSearchResults(searchResults.start + rows, sort);
        }, 250);
      }
    });
    scrollBottom.current !== null && scrollObserver.observe(scrollBottom.current);
  }, [searchResults]);

  // Update search results when user sorts
  useEffect(() => {
    updateSearchResults(searchResults?.start ?? 0, sort);
  }, [sort]);

  // Get search results when user filters
  useEffect(() => {
    searchResults?.searchString !== undefined && newSearch(searchResults.searchString, sort);
  }, [facetFilters, rows]);

  const previousPage = (): void => {
    setStart(Number(searchResults?.start) - rows ?? 0);
    updateSearchResults(Number(searchResults?.start) - rows ?? 0, sort);
  };

  const nextPage = (): void => {
    setStart(Number(searchResults?.start) + rows ?? 0);
    updateSearchResults(Number(searchResults?.start) + rows ?? 0, sort);
  };

  // Process facets and counts into a single object
  const processFacets = (results: searchResult): facet[] => {
    const facets: facet[] = results.metadata.facets.map((facet: facetLabel) => {
      const fields: facetField[] = [];
      for (let i = 0; i < results.facet_counts.facet_fields[facet.name].length; i = i + 2) {
        fields.push({
          title: results.facet_counts.facet_fields[facet.name][i],
          count: results.facet_counts.facet_fields[facet.name][i + 1]
        });
      }
      return {
        name: facet.name,
        label: facet.label,
        fields
      }
    });
    return facets;
  };

  // Add/update existing search requests for facets, sortings, and infinite scroll
  const updateSearchResults = (start: number, sort: string): void => {
    if (searchResults?.searchString !== undefined && !loading) {
      setLoading(true);
      void search(searchResults?.searchString, searchResults?.facetFilters, start, rows, sort).then((data: searchResult) => {
        const documents: foundDocument[] = searchResults?.docs !== undefined ? searchResults.docs : [];
        data.response.docs.forEach((doc: foundDocument, index: number) => {
          documents[Number(data.response.start) + index] = doc;
        });
        const results: searchResultsPage = {
          searchString: searchResults.searchString,
          facetFilters: searchResults?.facetFilters,
          start: data.response.start,
          numFound: data.response.numFound,
          docs: documents,
          externalLinks: data.externalLinks,
          facets: processFacets(data)
        }
        setSearchResults(results);
        setLoading(false);
      });
    }
  };

  // Start a new search for a user's query and optionally track search or related keyword analytics data
  const newSearch = (searchString: string, sort: string = '', searchType: string = '_search'): void => {
    if (searchString !== '') {
      setLoading(true);
      // setSearchResults(undefined);
      void search(searchString, facetFilters, 0, rows, sort).then((data: searchResult) => {
        const documents: foundDocument[] = [];
        data.response.docs.forEach((doc: foundDocument, index: number) => {
          documents[index] = doc;
        });
        const results = {
          searchString,
          facetFilters,
          start: data.response.start,
          numFound: data.response.numFound,
          docs: documents,
          externalLinks: data.externalLinks,
          facets: processFacets(data)
        }
        setSortOptions([
          ...defaultSort,
          ...data.metadata.sorts.map((sort) => {
            return { value: `${String(sort.name)} ${String(sort.order)}`, label: sort.label }
          })
        ]);
        setSpellcheck(data?.spellcheck?.suggestions[1]?.suggestion[0].word ?? '');
        setSearchResults(results);
        setStart(0);
        ReactGA.event({
          category: 'site_search',
          action: 'search-query',
          label: searchString,
          value: data.response.numFound
        });
        const reportData: event = {
          event: searchType,
          properties: {
            session: sessionId,
            query: searchString,
            shownHits: searchResults?.docs.length,
            pageNo: searchResults?.start ?? 0 / rows,
            _vid: uuid,
            language
          }
        }
        void trackEvent(reportData);
        setLoading(false);
      });
    }
  };

  // Track click events for analytics and then open the target URL
  const handleClick = (url: string, title: string = '', position: number = 0): void => {
    ReactGA.event({
      category: 'site_search',
      action: 'search-result-click',
      label: searchResults?.searchString,
      value: 1
    });
    const reportData: event = {
      event: '_searchclick',
      properties: {
        session: sessionId,
        query: searchResults?.searchString,
        shownHits: rows,
        pageNo: searchResults?.start ?? 0 / rows,
        _vid: uuid,
        cDocId: url,
        cDocTitle: title,
        position,
        language
      }
    }
    void trackEvent(reportData);
    window.location.href = url;
  };

  return (
    <div className="SearchResultPage">
      <header className="SearchResultPage-header">
        <SearchBox
          searchQuery={searchResults?.searchString}
          submitCallback={newSearch}
          searchLoading={loading}
          language={language}
        />
        <Feedback sessionId={sessionId} uuid={uuid} />
      </header>
      <RelatedSearches searchQuery={searchResults?.searchString} newSearchCallback={newSearch} language={language} />
      {!loading || (searchResults?.docs?.length !== undefined && searchResults?.docs?.length > 0)
        ? (searchResults?.docs?.length !== undefined && searchResults?.docs?.length > 0)
            ? (
            <div className={facetType === 'list' ? 'SearchResultPage-body' : 'SearchResultPage-body-inline'}>
              <div className="SearchResultPage-facets">
                {(searchResults?.facets?.length !== undefined && searchResults?.facets?.length > 0)
                  ? (
                      searchResults.facets.map((facet: facet, index: number) => {
                        if (facetType === 'menu') {
                          return <FacetMenu key={index} facet={facet} filters={facetFilters} handleChange={setFacetFilters} />
                        } else if (facetType === 'group') {
                          return <FacetGroup key={index} facet={facet} filters={facetFilters} handleChange={setFacetFilters} />
                        } else if (facetType === 'list') {
                          return <FacetList key={index} facet={facet} filters={facetFilters} handleChange={setFacetFilters} />
                        } else {
                          return <FacetGroup key={index} facet={facet} filters={facetFilters} handleChange={setFacetFilters} />
                        }
                      })
                    )
                  : ''
                }
              </div>
              <div className="SearchResultPage-results">
                <div>
                  <div className="SearchResultPage-options">
                    <div>
                      {!loadOnScroll
                        ? (
                          <>
                            Showing <b>{start + 1}</b> to <b>{start + rows}</b> of <b>{searchResults?.numFound}</b> results for <b>&quot;{searchResults?.searchString}&quot;</b>
                          </>
                          )
                        : (
                          <>
                            Showing <b>{searchResults?.docs?.length}</b> of <b>{searchResults?.numFound}</b> results for <b>&quot;{searchResults?.searchString}&quot;</b>
                          </>
                          )
                      }
                    </div>
                    <div className="SearchResultPage-sort">
                      View Style
                      <button
                        className={viewStyle === 'list' ? 'SearchResultPage-toggle-list' : 'SearchResultPage-toggle-grid'}
                        onClick={() => { viewStyle === 'list' ? setViewStyle('grid') : setViewStyle('list') }}
                      />
                      Sort By
                      <select
                        className="SearchResultPage-sort-menu"
                        onChange={(event) => { setSort(event.target.value) }}
                      >
                        {sortOptions.map((option: selectOption, index: number) => (
                          <option key={index} label={option.label} value={option.value} />
                        ))}
                      </select>
                      {!loadOnScroll
                        ? (
                          <>
                            Show
                            <select
                              className="SearchResultPage-sort-menu"
                              onChange={(event) => { setRows(Number(event.target.value)) }}
                              value={rows}
                            >
                              {rowOptions.map((count: number, index: number) => (
                                <option key={index} label={String(count)} value={count} />
                              ))}
                            </select>
                          </>
                          )
                        : ''
                      }
                    </div>
                  </div>
                  <>
                    {
                      searchResults?.externalLinks?.map((result, index: number) => (
                        <ExternalSearchSnippet key={index} result={result} handleClick={handleClick} />
                      ))
                    }
                  </>
                  <div className={viewStyle === 'list' ? 'SearchResultPage-result-list' : 'SearchResultPage-result-grid'}>
                    {loadOnScroll
                      ? searchResults?.docs.map((result: foundDocument, index: number) => (
                        <SearchSnippet key={index} result={result} handleClick={handleClick} position={index} />
                      ))
                      : searchResults?.docs.slice(start, start + rows).map((result: foundDocument, index: number) => (
                        <SearchSnippet key={index} result={result} handleClick={handleClick} position={index} />
                      ))
                    }
                  </div>
                  <div className="SearchResultPage-scrollBottom" ref={scrollBottom}>
                    <div>
                      {loading
                        ? (
                          <div className="SearchResultPage-loading" />
                          )
                        : ''
                      }
                      {!loadOnScroll
                        ? (
                            <>
                              <button
                                className="SearchResultPage-pagination-button"
                                onClick={previousPage}
                                disabled={start === 0}
                              >
                                &lt; Previous
                              </button>
                              Showing <b>{start + 1}</b> to <b>{start + rows}</b> of <b>{searchResults?.numFound}</b> results for <b>&quot;{searchResults?.searchString}&quot;</b>
                              <button
                                className="SearchResultPage-pagination-button"
                                onClick={nextPage}
                                disabled={(start + rows) > searchResults.numFound}
                              >
                                Next &gt;
                              </button>
                            </>
                          )
                        : (
                          <>
                            Showing <b>{searchResults?.docs.length}</b> of <b>{searchResults?.numFound}</b> results for <b>&quot;{searchResults?.searchString}&quot;</b>
                          </>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )
            : searchResults?.searchString !== undefined
              ? spellcheck !== ''
                ? (
                  <>
                    <div>We&apos;re sorry, we couldn&apos;t find any results for <strong>&quot;{searchResults?.searchString}&quot;</strong></div>
                    <div>Did you mean <div className="SearchResultPage-spellcheck" onClick={() => { newSearch(spellcheck) }}>{spellcheck}</div>?</div>
                  </>
                  )
                : (
                  <>
                    <div>No results found for <strong>&quot;{searchResults?.searchString}&quot;</strong></div>
                    <div>Try searching for search related terms or topics. We offer a wide variety of content to help you get the information you need.</div>
                  </>
                  )
              : <PopularSearches newSearchCallback={newSearch} language={language} />
        : <div className="SearchResultPage-loading" /> }
    </div>
  );
}
