const createPayloadAdmin = (user) => {
  return {
    _id: user._id,
    nama: user.nama,
    username: user.username,
    role: user.role,
  };
};

const createPayloadGuru = (user) => {
  return {
    _id: user._id,
    nip: user.nip,
    nama: user.nama,
    jenisKelamin: user.jenisKelamin,
    agama: user.agama,
    alamat: user.alamat,
    noHp: user.noHp,
    mataPelajaran: user.mataPelajaran,
    username: user.username,
    role: user.role,
  };
};

const createPayloadSiswa = (user) => {
  return {
    _id: user._id,
    nisn: user.nisn,
    nama: user.nama,
    jenisKelamin: user.jenisKelamin,
    agama: user.agama,
    alamat: user.alamat,
    noHp: user.noHp,
    kelas: user.kelas,
    jurusan: user.jurusan,
    mataPelajaran: user.mataPelajaran,
    username: user.username,
    role: user.role,
  };
};

const createPayloadOrangTua = (user) => {
  return {
    _id: user._id,
    nama: user.nama,
    alamat: user.alamat,
    noHp: user.noHp,
    siswa: user.siswa,
    username: user.username,
    role: user.role,
  };
};

module.exports = {
  createPayloadAdmin,
  createPayloadGuru,
  createPayloadSiswa,
  createPayloadOrangTua,
};
