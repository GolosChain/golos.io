const AUTH_KEY = 'authData';
export const REGISTRATION_KEY = 'registrationData';
const VESTING = 'golos.vesting-opened';

export function saveAuth(userId, privateKey) {
  const str = [userId, privateKey].join(':');

  localStorage.setItem(AUTH_KEY, Buffer.from(str).toString('hex'));
}

export function getAuth() {
  const data = localStorage.getItem(AUTH_KEY);

  if (!data) {
    return null;
  }

  const parts = Buffer.from(data, 'hex')
    .toString()
    .split(':');

  if (parts.length < 2 || !parts[0] || !parts[1]) {
    return null;
  }

  return {
    userId: parts[0],
    privateKey: parts[1],
  };
}

export function removeAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function setRegistrationData(data) {
  const previousData = JSON.parse(localStorage.getItem(REGISTRATION_KEY));
  localStorage.setItem(REGISTRATION_KEY, JSON.stringify({ ...previousData, ...data }));
}

export function getRegistrationData() {
  const data = localStorage.getItem(REGISTRATION_KEY);
  return data ? JSON.parse(data) : {};
}

export function removeRegistrationData() {
  localStorage.removeItem(REGISTRATION_KEY);
}

export function isVestingAlreadyOpened(userId) {
  const json = localStorage.getItem(VESTING);

  if (!json) {
    return false;
  }

  const data = JSON.parse(json);

  return data.includes(userId);
}

export function markVestingOpened(userId) {
  const json = localStorage.getItem(VESTING);

  let list = [];

  if (json) {
    list = JSON.parse(json);
  }

  list.push(userId);

  localStorage.setItem(VESTING, JSON.stringify(list));
}
