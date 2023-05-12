import type { searchResult, facetFilter } from '../interface/searchResults';

export const search = async (
  search: string,
  filter: facetFilter[],
  start: number = 0,
  rows: number = 30,
  sort: string = '',
  language: string = ''
): Promise<searchResult> => {
  const url = new URL(process.env.REACT_APP_SS_SEARCH_URL ?? '');
  url.searchParams.append('q', search);
  url.searchParams.append('start', String(start));
  url.searchParams.append('rows', String(rows));
  filter.forEach((facet: facetFilter) => {
    facet.filter.forEach((filter: string) => {
      url.searchParams.append('fq', `${String(facet.name)}:"${filter}"`)
    })
  })
  sort !== '' && url.searchParams.append('sort', sort);
  language !== '' && url.searchParams.append('language', language);
  return await fetch(url.href, {
    method: 'get',
    headers: {
      Authorization: `Basic ${process.env.REACT_APP_SS_AUTH ?? ''}`
    }
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('error')
      }
      return await response.json();
    })
    .catch((error: Error) => {
      throw error
    });
}
