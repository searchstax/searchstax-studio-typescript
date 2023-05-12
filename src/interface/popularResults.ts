
export interface popularResult {
  query: string,
  count: number,
}

export interface popularResults {
  response: {
    numFound: number,
    start: number,
    docs: popularResult[],
  },
}
