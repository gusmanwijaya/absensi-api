const Jurusan = require("../models/jurusan");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await Jurusan.find().select("_id nama");

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data jurusan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id: jurusanId } = req.params;

      const data = await Jurusan.findOne({ _id: jurusanId }).select("_id nama");

      if (!data)
        throw new CustomError.NotFound(
          `Jurusan dengan id ${jurusanId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data jurusan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { nama } = req.body;

      const checkNama = await Jurusan.findOne({ nama }).select("nama");
      if (checkNama)
        throw new CustomError.BadRequest(`Nama : ${nama} sudah terdaftar`);

      const data = new Jurusan({
        nama,
      });
      await data.save();

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data jurusan berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: jurusanId } = req.params;
      const { nama } = req.body;

      const checkNama = await Jurusan.findOne({
        _id: {
          $ne: jurusanId,
        },
        nama,
      }).select("nama");
      if (checkNama)
        throw new CustomError.BadRequest(`Nama : ${nama} sudah terdaftar`);

      let data = await Jurusan.findOne({ _id: jurusanId });

      if (!data)
        throw new CustomError.NotFound(
          `Jurusan dengan id ${jurusanId} tidak ditemukan`
        );

      data.nama = nama;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data jurusan berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: jurusanId } = req.params;

      let data = await Jurusan.findOne({ _id: jurusanId });

      if (!data)
        throw new CustomError.NotFound(
          `Jurusan dengan id ${jurusanId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data jurusan berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
