import jobboardMock from './data/jobboard.mock.json';

export async function getJobBoardMock() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return jobboardMock;
}
