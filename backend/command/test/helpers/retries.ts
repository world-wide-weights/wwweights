export const retryCallback = async (
  callback: () => Promise<boolean>,
  maxDuration = 1000,
) => {
  const startTime = performance.now();
  while (performance.now() - startTime < maxDuration) {
    const currentResult = await callback();
    if (currentResult) {
      return true;
    }
  }
  throw new Error('Callback condition never met. Timeout!');
};
