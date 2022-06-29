const Kelas = require("../models/kelas");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await Kelas.find().select("_id nama");

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data kelas",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getOne: async (req, res, next) => {
    try {
      const { id: kelasId } = req.params;

      const data = await Kelas.findOne({ _id: kelasId }).select("_id nama");

      if (!data)
        throw new CustomError.NotFound(
          `Kelas dengan id ${kelasId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data kelas",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const { nama } = req.body;

      const checkNama = await Kelas.findOne({ nama }).select("nama");
      if (checkNama)
        throw new CustomError.BadRequest(`Nama : ${nama} sudah terdaftar`);

      const data = new Kelas({
        nama,
      });
      await data.save();

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data kelas berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: kelasId } = req.params;
      const { nama } = req.body;

      const checkNama = await Kelas.findOne({
        _id: {
          $ne: kelasId,
        },
        nama,
      }).select("nama");
      if (checkNama)
        throw new CustomError.BadRequest(`Nama : ${nama} sudah terdaftar`);

      let data = await Kelas.findOne({ _id: kelasId });

      if (!data)
        throw new CustomError.NotFound(
          `Kelas dengan id ${kelasId} tidak ditemukan`
        );

      data.nama = nama;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data kelas berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: kelasId } = req.params;

      let data = await Kelas.findOne({ _id: kelasId });

      if (!data)
        throw new CustomError.NotFound(
          `Kelas dengan id ${kelasId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data kelas berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
