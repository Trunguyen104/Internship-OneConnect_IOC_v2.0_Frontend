import dashboardMock from './data/dashboard.mock.json';

export async function getDashboardMock() {
  await new Promise((resolve) => setTimeout(resolve, 200)); // giả delay
  return dashboardMock;
}
