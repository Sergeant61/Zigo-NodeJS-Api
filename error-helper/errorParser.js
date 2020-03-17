module.exports = err => {
  switch (err.code) {
    case 11000:
      return "This user is already registered.";
    default:
      return err;
  }
};
