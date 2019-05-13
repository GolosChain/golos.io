/*import { APP_URL } from 'constants/config';*/
let APP_URL = '';
if (process.browser) {
  APP_URL = window.location.origin;
}

export const shareList = [
  {
    label: 'LiveJournal',
    icon: 'lj',
    ariaLabel: 'aria_label.share_on_lj',
    callback: ljShare,
  },
  {
    label: 'VK',
    icon: 'vk',
    ariaLabel: 'aria_label.share_on_vk',
    callback: vkShare,
  },
  /*{
    label: 'Facebook',
    icon: 'facebook',
    ariaLabel: 'aria_label.share_on_facebook',
    callback: fbShare,
  },*/
  {
    label: 'Twitter',
    icon: 'twitter',
    ariaLabel: 'aria_label.share_on_twitter',
    callback: twitterShare,
  },
];

function fbShare({ id }) {
  window.FB.ui(
    {
      method: 'share',
      href: `${APP_URL}/@${id}`,
    },
    response => {}
  );
}

function twitterShare({ content, id }) {
  const winWidth = 640;
  const winHeight = 320;
  const winTop = screen.height / 2 - winWidth / 2;
  const winLeft = screen.width / 2 - winHeight / 2;
  const url = `${APP_URL}/@${id}`;

  const hashtags = content.tags.map(tag => tag);

  const linkParams = {
    url,
    text: content.title,
    hashtags: hashtags.join(','),
  };

  const shareUrl = Object.keys(linkParams)
    .map(param => `${param}=${encodeURIComponent(linkParams[param])}`)
    .join('&');

  window.open(
    `http://twitter.com/share?${shareUrl}`,
    content.title,
    `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
  );
}

function vkShare({ content, id }) {
  const winWidth = 720;
  const winHeight = 480;
  const winTop = screen.height / 2 - winWidth / 2;
  const winLeft = screen.width / 2 - winHeight / 2;

  const url = `${APP_URL}/@${id}`;

  window.open(
    `https://vk.com/share.php?url=${url}`,
    content.title,
    `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
  );
}

function ljShare({ content, id }) {
  const url = `${APP_URL}/@${id}`;

  const link = `<div><a href="${url}">${content.title}</a></div>`;

  window.open(
    `http://www.livejournal.com/update.bml?subject=${content.title}&event=${content.title + link}`
  );
}
