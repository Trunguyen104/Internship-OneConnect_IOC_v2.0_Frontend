import httpClient from './httpClient';

export async function getJobBoardData() {
  const res = await httpClient.get('/jobboard');
  return res.data;
}
