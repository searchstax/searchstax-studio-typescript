
export interface relatedResult {
  search_term: string,
  related_search: string,
  related_score: number,
}

export interface relatedResults {
  response: {
    numFound: number,
    start: number,
    docs: relatedResult[],
  },
}
