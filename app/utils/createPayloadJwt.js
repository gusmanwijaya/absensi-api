const createPayloadAdmin = (user) => {
  return {
    _id: user._id,
    nama: user.nama,
    username: user.username,
    role: user.role,
  };
};

module.exports = {
  createPayloadAdmin,
};
