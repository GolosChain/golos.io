export const transformContacts = (contacts = {}) => ({
  facebook: contacts?.facebook,
  vk: contacts?.vkontakte,
  instagram: contacts?.instagram,
});
