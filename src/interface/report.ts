
export interface event {
  event: string,
  properties: {
    session: string,
    key?: string,
    query?: string,
    position?: number,
    shownHits?: number,
    totalHits?: number,
    latency?: number,
    pageNo?: number,
    impressions?: number,
    _vid: string,
    cDocId?: string,
    cDocTitle?: string,
    language?: string,
    email?: string,
    score?: number,
    comments?: string,
  },
}
