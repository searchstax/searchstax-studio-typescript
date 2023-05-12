import type { event } from '../interface/report';

export const trackEvent = async (
  event: event
): Promise<void> => {
  event.properties.key = process.env.REACT_APP_SS_ANALYTICS ?? '';
  const data = btoa(JSON.stringify(event));
  const url = `https://analytics-us.searchstax.com/api/v2/track/?data=${data}`;
  await fetch(url, {
    method: 'get'
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('error')
      }
    })
    .catch((error: Error) => {
      throw error
    });
}
