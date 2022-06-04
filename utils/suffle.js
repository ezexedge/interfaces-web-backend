exports.random = (array) => {
  return array.sort(() => Math.random() - 0.5);
};
