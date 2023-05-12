export interface suggestion {
  term: string,
  weight: number,
  payload: string,
}

export interface suggestResults {
  suggest: {
    studio_suggestor_en: {
      [key: string]: {
        numFound: number,
        suggestions: suggestion[],
      },
    },
  },
}
