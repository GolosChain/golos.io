const nextLinks = require('next-links').default;

const routes = nextLinks();

routes.add('feed', '/@:userId/feed', 'feed');
routes.add('created', '/created', 'feed');
routes.add('hot', '/hot', 'feed');
routes.add('home', '/', 'feed');
routes.add('trending', '/trending', 'feed');
// routes.add('agreement', '/agreement');
// routes.add('communities', '/communities');
// routes.add('community', '/c/:communityId');
// routes.add('communitySection', '/c/:communityId/:section', 'community');
// routes.add('messenger', '/messenger');
// routes.add('policy', '/policies/:policy');
routes.add('post', '/@:userId/:refBlockNum(\\d+)/:permlink/:mode?');
// routes.add('trending', '/trending');
// routes.add('profileSection', '/@:userId/:section', 'profile');
routes.add('submit', '/submit', 'submit');
routes.add('login', '/login', 'login');
routes.add('profile', '/@:userId');
routes.add('profileSection', '/@:userId/:section/:subSection?', 'profile');
// routes.add('new', '/new');
// routes.add('wallet', '/wallet');
// routes.add('walletSection', '/wallet/:section', 'wallet');
// routes.add('walletSectionType', '/wallet/:section/:type', 'wallet');
// routes.add('notifications', '/notifications');
routes.add('market', '/market', 'market');
routes.add('witnesses', '/~witnesses');

module.exports = routes;
