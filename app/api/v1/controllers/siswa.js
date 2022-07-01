const Siswa = require("../models/siswa");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const data = await Siswa.find()
        .select(
          "_id nisn nama jenisKelamin agama alamat noHp kelas jurusan mataPelajaran username password role"
        )
        .limit(limit)
        .skip(limit * (page - 1))
        .populate({
          path: "kelas",
          select: "_id nama",
          model: "Kelas",
        })
        .populate({
          path: "jurusan",
          select: "_id nama",
          model: "Jurusan",
        })
        .populate({
          path: "mataPelajaran",
          select: "_id kode nama sks kelas jurusan",
          model: "MataPelajaran",
          populate: [
            {
              path: "kelas",
              select: "_id nama",
              model: "Kelas",
            },
            {
              path: "jurusan",
              select: "_id nama",
              model: "Jurusan",
            },
          ],
        });

      const count = await Siswa.countDocuments();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data siswa",
        current_page: parseInt(page),
        total_page: Math.ceil(count / limit),
        total_data: count,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id: siswaId } = req.params;

      const data = await Siswa.findOne({ _id: siswaId })
        .select(
          "_id nisn nama jenisKelamin agama alamat noHp kelas jurusan mataPelajaran username role"
        )
        .populate({
          path: "kelas",
          select: "_id nama",
          model: "Kelas",
        })
        .populate({
          path: "jurusan",
          select: "_id nama",
          model: "Jurusan",
        })
        .populate({
          path: "mataPelajaran",
          select: "_id kode nama sks kelas jurusan",
          model: "MataPelajaran",
          populate: [
            {
              path: "kelas",
              select: "_id nama",
              model: "Kelas",
            },
            {
              path: "jurusan",
              select: "_id nama",
              model: "Jurusan",
            },
          ],
        });

      if (!data)
        throw new CustomError.NotFound(
          `Siswa dengan id ${siswaId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data siswa",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const {
        nisn,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        kelas,
        jurusan,
        mataPelajaran,
        username,
        password,
      } = req.body;

      if (!password)
        throw new CustomError.BadRequest("Password tidak boleh kosong!");

      const checkNISN = await Siswa.findOne({ nisn }).select("nisn");
      if (checkNISN)
        throw new CustomError.BadRequest(`NISN : ${nisn} sudah terdaftar`);
      const checkUsername = await Siswa.findOne({ username }).select(
        "username"
      );
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      const data = new Siswa({
        nisn,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        kelas,
        jurusan,
        mataPelajaran: JSON.parse(mataPelajaran),
        username,
        password,
      });
      await data.save();
      delete data._doc.password;

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data siswa berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: siswaId } = req.params;
      const {
        nisn,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        kelas,
        jurusan,
        mataPelajaran,
        username,
      } = req.body;

      const checkNISN = await Siswa.findOne({
        _id: {
          $ne: siswaId,
        },
        nisn,
      }).select("nisn");
      if (checkNISN)
        throw new CustomError.BadRequest(`NISN : ${nisn} sudah terdaftar`);

      const checkUsername = await Siswa.findOne({
        _id: {
          $ne: siswaId,
        },
        username,
      }).select("username");
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      let data = await Siswa.findOne({ _id: siswaId });

      if (!data)
        throw new CustomError.NotFound(
          `Siswa dengan id ${siswaId} tidak ditemukan`
        );

      data.nisn = nisn;
      data.nama = nama;
      data.jenisKelamin = jenisKelamin;
      data.agama = agama;
      data.alamat = alamat;
      data.noHp = noHp;
      data.kelas = kelas;
      data.jurusan = jurusan;
      data.mataPelajaran = JSON.parse(mataPelajaran);
      data.username = username;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data siswa berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: siswaId } = req.params;

      let data = await Siswa.findOne({ _id: siswaId });

      if (!data)
        throw new CustomError.NotFound(
          `Siswa dengan id ${siswaId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data siswa berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
