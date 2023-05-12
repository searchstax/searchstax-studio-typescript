
export interface foundDocument {
  content_type: string[],
  url: string,
  title: string[],
  meta_description: string[],
  meta_image?: string,
  paths: string[],
  date: Date,
  author_name: string,
  '[elevated]': boolean,
}

export interface facet {
  name: string,
  label: string,
  fields: facetField[],
}

export interface facetLabel {
  name: string,
  label: string,
}

export interface facetField {
  title: string,
  count: number,
}

export interface facetFilter {
  name: string,
  filter: string[],
}

export interface externalLink {
  name: string,
  description: string,
  url: string,
}

export interface sortOptions {
  id: number,
  name: string,
  order: string,
  label: string,
}

export interface searchResult {
  externalLinks: externalLink[],
  response: {
    numFound: number,
    start: number,
    docs: foundDocument[],
  },
  facet_counts: {
    facet_fields: {
      [key: string]: any[],
    },
  },
  metadata: {
    facets: facetLabel[],
    sorts: sortOptions[],
  },
}

export interface searchResultsPage {
  searchString: string,
  facetFilters: facetFilter[],
  start: number,
  numFound: number,
  docs: foundDocument[],
  externalLinks?: externalLink[],
  facets?: facet[],
}
