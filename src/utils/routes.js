import Routes from 'shared/routes';

// eslint-disable-next-line import/prefer-default-export
export function getPathnameFromPath(path) {
  return Routes.findAndGetUrls(path).urls.as.replace(/[?#].*$/, '');
}
