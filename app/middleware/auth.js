const CustomError = require("../error");
const verifyJwt = require("../utils/verifyJwt");

const authenticationAdmin = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomError.Forbidden("Silahkan login terlebih dahulu");
    }

    const payload = verifyJwt(token);

    req.user = {
      _id: payload._id,
      nama: payload.nama,
      username: payload.username,
      password: payload.password,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticationGuru = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomError.Forbidden("Silahkan login terlebih dahulu");
    }

    const payload = verifyJwt(token);

    req.user = {
      _id: payload._id,
      nip: payload.nip,
      nama: payload.nama,
      jenisKelamin: payload.jenisKelamin,
      agama: payload.agama,
      alamat: payload.alamat,
      noHp: payload.noHp,
      mataPelajaran: payload.mataPelajaran,
      username: payload.username,
      password: payload.password,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticationSiswa = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomError.Forbidden("Silahkan login terlebih dahulu");
    }

    const payload = verifyJwt(token);

    req.user = {
      _id: payload._id,
      nisn: payload.nisn,
      nama: payload.nama,
      jenisKelamin: payload.jenisKelamin,
      agama: payload.agama,
      alamat: payload.alamat,
      noHp: payload.noHp,
      kelas: payload.kelas,
      jurusan: payload.jurusan,
      mataPelajaran: payload.mataPelajaran,
      username: payload.username,
      password: payload.password,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authenticationOrangTua = async (req, res, next) => {
  try {
    let token;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      throw new CustomError.Forbidden("Silahkan login terlebih dahulu");
    }

    const payload = verifyJwt(token);

    req.user = {
      _id: payload._id,
      nama: payload.nama,
      alamat: payload.alamat,
      noHp: payload.noHp,
      siswa: payload.siswa,
      username: payload.username,
      password: payload.password,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.Unauthorized(
        "Anda ditolak untuk mengakses route ini"
      );
    }
    next();
  };
};

module.exports = {
  authenticationAdmin,
  authenticationGuru,
  authenticationSiswa,
  authenticationOrangTua,
  authorizeRoles,
};
