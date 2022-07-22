const MataPelajaran = require("../models/mata-pelajaran");
const Kelas = require("../models/kelas");
const Jurusan = require("../models/jurusan");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const data = await MataPelajaran.find()
        .select("_id kode nama sks kelas jurusan")
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
        });

      const count = await MataPelajaran.countDocuments();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data mata pelajaran",
        current_page: parseInt(page),
        total_page: Math.ceil(count / limit),
        total_data: count,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getForSelect: async (req, res, next) => {
    try {
      const kelas = await Kelas.find().select("_id nama");
      const jurusan = await Jurusan.find().select("_id nama");

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data untuk select",
        data: {
          kelas,
          jurusan,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id: mataPelajaranId } = req.params;

      const data = await MataPelajaran.findOne({ _id: mataPelajaranId })
        .select("_id kode nama sks kelas jurusan")
        .populate({
          path: "kelas",
          select: "_id nama",
          model: "Kelas",
        })
        .populate({
          path: "jurusan",
          select: "_id nama",
          model: "Jurusan",
        });

      if (!data)
        throw new CustomError.NotFound(
          `Mata pelajaran dengan id ${mataPelajaranId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data mata pelajaran",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { kode, nama, sks, kelas, jurusan } = req.body;

      const checkKode = await MataPelajaran.findOne({ kode }).select("kode");
      if (checkKode)
        throw new CustomError.BadRequest(`Kode : ${kode} sudah terdaftar`);

      const data = new MataPelajaran({
        kode,
        nama,
        sks,
        kelas: JSON.parse(kelas),
        jurusan: JSON.parse(jurusan),
      });
      await data.save();

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data mata pelajaran berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: mataPelajaranId } = req.params;
      const { kode, nama, sks, kelas, jurusan } = req.body;

      const checkKode = await MataPelajaran.findOne({
        _id: {
          $ne: mataPelajaranId,
        },
        kode,
      }).select("kode");
      if (checkKode)
        throw new CustomError.BadRequest(`Kode : ${kode} sudah terdaftar`);

      let data = await MataPelajaran.findOne({ _id: mataPelajaranId });

      if (!data)
        throw new CustomError.NotFound(
          `Mata pelajaran dengan id ${mataPelajaranId} tidak ditemukan`
        );

      data.kode = kode;
      data.nama = nama;
      data.sks = sks;
      data.kelas = JSON.parse(kelas);
      data.jurusan = JSON.parse(jurusan);
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data mata pelajaran berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: mataPelajaranId } = req.params;

      let data = await MataPelajaran.findOne({ _id: mataPelajaranId });

      if (!data)
        throw new CustomError.NotFound(
          `Mata pelajaran dengan id ${mataPelajaranId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data mata pelajaran berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
