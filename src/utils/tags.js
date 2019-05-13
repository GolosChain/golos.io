import tt from 'counterpart';

import { Router } from 'shared/routes';

import { detransliterate } from './ParsersAndFormatters';
import { getPathnameFromPath } from './routes';

export const TAGS_MAX_LENGTH = 24;
export const NSFW_TAG = 'nsfw';
const NSFW_TAG_NUMERIC = '18+';

const FAVORITE_KEY = 'golos.favorite-tags';

function filterRealTags(tags) {
  return tags.filter(tag => tag !== NSFW_TAG_NUMERIC && tag !== NSFW_TAG);
}

export function validateTags(tags, finalCheck) {
  const realTags = filterRealTags(tags);

  if (finalCheck && realTags.length === 0) {
    return tt('category_selector_jsx.must_set_category');
  }

  for (const tag of realTags) {
    const error = validateTag(tag);

    if (error) {
      return error;
    }
  }
}

export function validateTag(tag) {
  if (tag === NSFW_TAG_NUMERIC) {
    return null;
  }

  if (tag.length > TAGS_MAX_LENGTH) {
    return tt('category_selector_jsx.maximum_tag_length_is_24_characters');
  }
  if (tag.replace(/^[a-z]+--/i, '').split('-').length > 2) {
    return tt('category_selector_jsx.use_one_dash');
  }
  if (tag.includes(',')) {
    return tt('category_selector_jsx.use_spaces_to_separate_tags');
  }
  if (tag.toLowerCase() !== tag) {
    return tt('category_selector_jsx.use_only_lowercase_letters');
  }
  if (!/^[a-zа-яё0-9-ґєії]+$/.test(tag)) {
    return tt('category_selector_jsx.use_only_allowed_characters');
  }
  if (!/^[a-zа-яё-ґєії]/.test(tag)) {
    return tt('category_selector_jsx.must_start_with_a_letter');
  }
  if (!/[a-zа-яё0-9ґєії]$/.test(tag)) {
    return tt('category_selector_jsx.must_end_with_a_letter_or_number');
  }
  if (tag === 'stihi-io') {
    return tt('category_selector_jsx.denied_to_publish_the_posts_with_tag');
  }
  return null;
}

export function processTagsFromData(tags) {
  return tags.map(tag => detransliterate(tag));
}

function isCyrillicTag(tag) {
  return /[а-яёґєії]/.test(tag);
}

// function startsWithRU(tag) {
//   return /ru--/.test(tag);
// }

function processCyrillicTag(tag) {
  return `ru--${detransliterate(tag, true)}`;
}

export function processTagsToSend(tags) {
  return tags.map(item => (isCyrillicTag(item) ? processCyrillicTag(item) : item));
}

function loadFavoriteTags() {
  try {
    const tagsJson = localStorage.getItem(FAVORITE_KEY);

    if (tagsJson) {
      return JSON.parse(tagsJson);
    }
  } catch (err) {
    console.error(err);
  }
}

export function getFavoriteTags() {
  const tags = loadFavoriteTags();

  if (tags) {
    return tags.slice(0, 5).map(tagInfo => tagInfo[0]);
  }
  return [];
}

export function updateFavoriteTags(tags) {
  try {
    const savedTags = loadFavoriteTags() || [];

    const tagsSet = new Set(tags);

    for (const tag of savedTags) {
      if (tagsSet.has(tag[0])) {
        tag[1]++;
        tagsSet.delete(tag[0]);
      }
    }

    for (const tag of tagsSet) {
      savedTags.push([tag, 1]);
    }

    savedTags.sort((a, b) => b[1] - a[1]);

    localStorage.setItem(FAVORITE_KEY, JSON.stringify(savedTags));
  } catch (err) {
    console.error(err);
  }
}

// export function reverseTag(tag) {
//   if (isCyrillicTag(tag)) {
//     return processCyrillicTag(tag);
//   }
//   if (startsWithRU(tag)) {
//     return detransliterate(tag);
//   }
// }

// export function reverseTags(tags) {
//   const newTags = [];
//
//   for (const t of tags) {
//     newTags.push(t);
//
//     const reversed = reverseTag(t);
//     if (reversed) {
//       newTags.push(reversed);
//     }
//   }
//
//   return newTags;
// }

// export function prepareTrendingTags(tags) {
//   const t_tags = new Set();
//   tags.map(t => {
//     t_tags.add(startsWithRU(t.name) ? detransliterate(t.name) : t.name);
//   });
//
//   return Array.from(t_tags);
// }

export function getSelectedTags() {
  return Router.query.tags ? Router.query.tags.split(',').sort() : [];
}

export function toggleTag(tag) {
  const selectedTags = getSelectedTags();
  const selectedTagIndex = selectedTags.indexOf(tag);

  if (selectedTagIndex !== -1) {
    selectedTags.splice(selectedTagIndex, 1);
  } else {
    selectedTags.push(tag);
  }

  const tagsStr = selectedTags.join(',');

  const pathname = getPathnameFromPath(Router.router.asPath);
  let route = pathname;
  if (tagsStr.length) {
    route += `?tags=${tagsStr}`;
  }
  Router.pushRoute(route);
}
