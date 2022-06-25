const Guru = require("../models/guru");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");
const mongoose = require("mongoose");

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const data = await Guru.find()
        .select(
          "_id nip nama jenisKelamin agama alamat noHp mataPelajaran username role"
        )
        .limit(limit)
        .skip(limit * (page - 1))
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

      const count = await Guru.countDocuments();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data guru",
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
      const { id: guruId } = req.params;

      const data = await Guru.findOne({ _id: guruId })
        .select(
          "_id nip nama jenisKelamin agama alamat noHp mataPelajaran username role"
        )
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
          `Guru dengan id ${guruId} tidak ditemukan`
        );

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data guru",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const {
        nip,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        mataPelajaran,
        username,
        password,
      } = req.body;

      if (!password)
        throw new CustomError.BadRequest("Password tidak boleh kosong!");

      const checkNIP = await Guru.findOne({ nip }).select("nip");
      if (checkNIP)
        throw new CustomError.BadRequest(`NIP : ${nip} sudah terdaftar`);
      const checkUsername = await Guru.findOne({ username }).select("username");
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      const data = new Guru({
        nip,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        mataPelajaran: JSON.parse(mataPelajaran),
        username,
        password,
      });
      await data.save();
      delete data._doc.password;

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data guru berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const { id: guruId } = req.params;
      const {
        nip,
        nama,
        jenisKelamin,
        agama,
        alamat,
        noHp,
        mataPelajaran,
        username,
      } = req.body;

      const checkNIP = await Guru.findOne({
        _id: {
          $ne: guruId,
        },
        nip,
      }).select("nip");
      if (checkNIP)
        throw new CustomError.BadRequest(`NIP : ${nip} sudah terdaftar`);

      const checkUsername = await Guru.findOne({
        _id: {
          $ne: guruId,
        },
        username,
      }).select("username");
      if (checkUsername)
        throw new CustomError.BadRequest(
          `Username : ${username} sudah terdaftar`
        );

      let data = await Guru.findOne({ _id: guruId });

      if (!data)
        throw new CustomError.NotFound(
          `Guru dengan id ${guruId} tidak ditemukan`
        );

      data.nip = nip;
      data.nama = nama;
      data.jenisKelamin = jenisKelamin;
      data.agama = agama;
      data.alamat = alamat;
      data.noHp = noHp;
      data.mataPelajaran = JSON.parse(mataPelajaran);
      data.username = username;
      await data.save();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data guru berhasil diubah",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  destroy: async (req, res, next) => {
    try {
      const { id: guruId } = req.params;

      let data = await Guru.findOne({ _id: guruId });

      if (!data)
        throw new CustomError.NotFound(
          `Guru dengan id ${guruId} tidak ditemukan`
        );

      await data.remove();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Data guru berhasil dihapus",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
