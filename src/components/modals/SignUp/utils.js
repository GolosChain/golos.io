import {
  PHONE_SCREEN_ID,
  CONFIRM_CODE_SCREEN_ID,
  CREATE_USERNAME_SCREEN_ID,
  MASTER_KEY_SCREEN_ID,
  CONGRATULATIONS_SCREEN_ID,
} from './constants';

export function createPdf(keys, { userId, username, phoneNumber }) {
  const { master, owner, active } = keys;

  const privateKeysPdf = [
    `phone number: ${phoneNumber} `,
    `user id: ${userId}`,
    `username: ${username}`,
    `masterKey: ${master}`,
    `active: ${active.privateKey}`,
    `owner: ${owner.privateKey}`,
  ];

  let JsPdf = null;
  if (process.browser) {
    // eslint-disable-next-line global-require
    JsPdf = require('jspdf');
  }

  const pdfDoc = new JsPdf({
    orientation: 'landscape',
    format: 'a4',
  });
  pdfDoc.setFontSize(20);
  pdfDoc.text(privateKeysPdf, 10, 50);
  pdfDoc.save(`Golos-private-keys(${username}).pdf`);
}

// eslint-disable-next-line consistent-return
export function stepToScreenId(step) {
  switch (step) {
    case 'firstStep':
      return PHONE_SCREEN_ID;
    case 'verify':
      return CONFIRM_CODE_SCREEN_ID;
    case 'setUsername':
      return CREATE_USERNAME_SCREEN_ID;
    case 'toBlockChain':
      return MASTER_KEY_SCREEN_ID;
    case 'registered':
      return CONGRATULATIONS_SCREEN_ID;
    default:
  }
}
