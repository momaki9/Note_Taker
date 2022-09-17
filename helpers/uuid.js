// Immediately export a function that generates a string of random numbers and letters
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x100000000000)
    .toString(18)
    .substring(2);
