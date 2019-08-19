const nextLinks = require('next-links').default;

const routes = nextLinks();

routes.add('feed', '/@:userId/feed', 'feed');
routes.add('created', '/created', 'feed');
routes.add('hot', '/hot', 'feed');
routes.add('home', '/', 'feed');
routes.add('trending', '/trending', 'feed');
// routes.add('agreement', '/agreement');
// routes.add('policy', '/policies/:policy');
routes.add('profile', '/@:userId');
routes.add(
  'profileSection',
  '/@:userId/:section(comments|replies|favorites|wallet|activity|settings)/:section2?/:section3?/:section4?',
  'profile'
);
routes.add('post', '/@:userId/:permlink/:mode?');

// Support legacy url format (with tag)
routes.add('postRedirect', '/:tag/@:userId/:permlink/:mode?');

// routes.add('trending', '/trending');
// routes.add('profileSection', '/@:userId/:section', 'profile');
routes.add('submit', '/submit', 'submit');
routes.add('login', '/login', 'login');

// routes.add('new', '/new');
// routes.add('wallet', '/wallet');
// routes.add('walletSection', '/wallet/:section', 'wallet');
// routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
// routes.add('notifications', '/notifications');
routes.add('market', '/market', 'market');
routes.add('witnessesProposals', '/~witnesses/proposals', 'witnesses');
routes.add('witnesses', '/~witnesses');
routes.add('validators', '/validators', 'validators');

routes.add('leavePage', '/leave');

module.exports = routes;
