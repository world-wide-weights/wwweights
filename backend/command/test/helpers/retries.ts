/**
 * @description Retry passed callback until completion or timeout is exceeded. If its the ladder an error is thrown to stop the test
 */
export const retryCallback = async (
  callback: () => Promise<boolean>,
  maxDuration = 1000,
): Promise<void> => {
  const startTime = performance.now();
  while (performance.now() - startTime < maxDuration) {
    const currentResult = await callback();
    if (currentResult) return;
  }
  throw new Error('Callback condition never met. Timeout!');
};
