import fetch from 'isomorphic-unfetch';
import ToastsManager from 'toasts-manager';
import tt from 'counterpart';

import { MAX_UPLOAD_FILE_SIZE, ALLOWED_IMAGE_TYPES, imgHostingUrl } from 'constants/config';

export async function uploadImage(file) {
  if (!file) {
    throw new Error('No file');
  }

  const formData = new FormData();

  formData.append('file', file);

  const result = await fetch(`${imgHostingUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await result.json();

  return data.url;
}

export async function uploadImageSafe(file) {
  try {
    return await uploadImage(file);
  } catch (err) {
    console.error(err);
    ToastsManager.error('Image uploading failed:', err.message);
  }
}

export function validateAndUpload(file) {
  if (validateImageFile(file)) {
    return uploadImageSafe(file);
  }
}

export function validateImageFile(file) {
  if (!file) {
    ToastsManager.error(tt('reply_editor.please_insert_only_image_files'));
    return false;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    ToastsManager.error(tt('reply_editor.please_insert_only_image_files'));
    return false;
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    ToastsManager.error(
      `Too big file, max allowed size is ${Math.floor(MAX_UPLOAD_FILE_SIZE / (1024 * 1024))} MB`
    );
    return false;
  }

  return true;
}
