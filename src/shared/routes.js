const nextLinks = require('next-links').default;

const routes = nextLinks();

routes.add('feed', '/@:username/feed', 'feed');
routes.add('feed~', '/~:userId/feed', 'feed');
routes.add('created', '/created', 'feed');
routes.add('hot', '/hot', 'feed');
routes.add('home', '/', 'feed');
routes.add('trending', '/trending', 'feed');
// routes.add('agreement', '/agreement');
// routes.add('policy', '/policies/:policy');
routes.add('profile', '/@:username');
routes.add('profile~', '/~:userId', 'profile');

const profileSectionPath =
  ':section(comments|replies|favorites|wallet|activity|settings)/:section2?/:section3?/:section4?';
routes.add('profileSection', `/@:username/${profileSectionPath}`, 'profile');
routes.add('profileSection~', `/~:userId/${profileSectionPath}`, 'profile');

routes.add('post', '/@:username/:permlink/:mode?');
routes.add('post~', '/~:userId/:permlink/:mode?', 'post');

// Support legacy url format (with tag)
routes.add('postRedirect', '/:tag/@:username/:permlink/:mode?');
routes.add('postRedirect~', '/:tag/~:userId/:permlink/:mode?', 'postRedirect');

// routes.add('trending', '/trending');
routes.add('submit', '/submit', 'submit');
routes.add('login', '/login', 'login');

// routes.add('new', '/new');
// routes.add('wallet', '/wallet');
// routes.add('walletSection', '/wallet/:section', 'wallet');
// routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
// routes.add('notifications', '/notifications');
routes.add('market', '/market', 'market');
routes.add('leaders', '/leaders/:subRoute(proposals)?/:proposerId?/:proposalId?');
// Legacy url (redirect to leaders)
routes.add('witnesses', '/~witnesses');
routes.add('validators', '/validators', 'validators');

routes.add('leavePage', '/leave');

module.exports = routes;
