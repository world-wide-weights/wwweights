import * as fs from 'fs';
import * as path from 'path';

/**
 * @description Take in path and make sure that it´s a global path and not undefined
 */
export function pathBuilder(initialPath: string, localFallbackFolder: string) {
  // Set OS specific variables for path handling
  const absolutePathIndicator = getOSAbsolutePathIndicator();
  // No path? Use local as fallback
  if (!initialPath) {
    return path.resolve(localFallbackFolder);
  }
  // Is absolute path
  if (initialPath.match(absolutePathIndicator)) {
    return initialPath;
  }
  return path.resolve(initialPath);
}
/**
 * @description Get Regex to detect absolute paths for the current OS
 */
export function getOSAbsolutePathIndicator() {
  return process.platform.startsWith('win')
    ? new RegExp('^[A-Z]:.*')
    : new RegExp('^/.*');
}
/**
 * @description Validate a given path to be a directory. If the directory does not yet exist => create it
 */
export function validateOrCreateDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
  if (!fs.lstatSync(path).isDirectory()) {
    throw new Error(
      `${path} does not point to directory and therefore is not allowed in this context`,
    );
  }
}
