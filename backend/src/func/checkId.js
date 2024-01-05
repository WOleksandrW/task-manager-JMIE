function checkId(id) {
  const regexp = new RegExp(/^[0-9a-fA-F]{24}$/);
  return !!regexp.exec(id);
}

module.exports = checkId;
