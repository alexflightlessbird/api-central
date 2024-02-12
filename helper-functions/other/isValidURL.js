function isValidURL(str) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(str);
}

module.exports = isValidURL;
