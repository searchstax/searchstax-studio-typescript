import type { suggestResults } from '../interface/suggestResults';

export const suggest = async (
  search: string,
  language: string = ''
): Promise<suggestResults> => {
  const url = new URL(process.env.REACT_APP_SS_SUGGEST_URL ?? '');
  url.searchParams.append('q', search);
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
