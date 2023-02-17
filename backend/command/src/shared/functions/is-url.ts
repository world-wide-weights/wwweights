export const IsUrl = (potentialUrl: string) => {
  try {
    new URL(potentialUrl);
  } catch (_) {
    return false;
  }
  return true;
};
