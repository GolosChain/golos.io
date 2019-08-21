import { has } from 'ramda';

// TODO: Legacy code, must refactor!
export function isHide(post) {
  if (!post) {
    return false;
  }
  if (post instanceof Map) {
    return post.get('json_metadata').startsWith('{"hash"');
  }
  return post.metadata ? has('hash', post.metadata) : false;
}
