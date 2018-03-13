module.exports = {
  name: 'string',
  email: 'email',
  types: {
    email: v => {
      return Boolean(v.indexOf('@') != -1);
    }
  }
};
