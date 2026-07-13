const MOCK_NETWORK_DELAY_MS = 700;

export function waitForMockNetworkDelay() {
  // ponytail: fixed delay is enough for UI refresh/loadmore checks; use env config if timing scenarios grow.
  return new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_NETWORK_DELAY_MS);
  });
}
