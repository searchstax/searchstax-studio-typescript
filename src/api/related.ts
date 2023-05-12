import type { relatedResults } from '../interface/relatedResults';

export const related = async (
  search: string,
  language: string = ''
): Promise<relatedResults> => {
  const url = new URL('https://app.searchstax.com/api/v1/40/related-search/');
  url.searchParams.append('search', search);
  language !== '' && url.searchParams.append('language', language);
  return await fetch(url.href, {
    method: 'get',
    headers: {
      Authorization: `${process.env.REACT_APP_SS_DISCOVERY ?? ''}`
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
