const Guru = require("../models/guru");
const Jurusan = require("../models/jurusan");
const Kelas = require("../models/kelas");
const MataPelajaran = require("../models/mata-pelajaran");
const OrangTua = require("../models/orang-tua");
const Siswa = require("../models/siswa");
const Absensi = require("../models/absensi");
const { StatusCodes } = require("http-status-codes");

module.exports = {
  getDashboardAdmin: async (req, res, next) => {
    try {
      const guru = await Guru.countDocuments();
      const jurusan = await Jurusan.countDocuments();
      const kelas = await Kelas.countDocuments();
      const mataPelajaran = await MataPelajaran.countDocuments();
      const orangTua = await OrangTua.countDocuments();
      const siswa = await Siswa.countDocuments();

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data dashboard!",
        data: {
          guru,
          jurusan,
          kelas,
          mataPelajaran,
          orangTua,
          siswa,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDashboardGuru: async (req, res, next) => {
    try {
      const mataPelajaran = req.user.mataPelajaran.length;
      const absensi = await Absensi.countDocuments({ guru: req.user._id });

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data dashboard!",
        data: {
          mataPelajaran,
          absensi,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDashboardSiswa: async (req, res, next) => {
    try {
      const alpa = await Absensi.countDocuments({
        siswa: req.user._id,
        keterangan: "Alpa",
      });
      const hadir = await Absensi.countDocuments({
        siswa: req.user._id,
        keterangan: "Hadir",
      });
      const izin = await Absensi.countDocuments({
        siswa: req.user._id,
        keterangan: "Izin",
      });
      const sakit = await Absensi.countDocuments({
        siswa: req.user._id,
        keterangan: "Sakit",
      });

      const history = await Absensi.find({
        siswa: req.user._id,
      })
        .select("_id tanggal pertemuan mataPelajaran siswa guru keterangan")
        .populate({
          path: "mataPelajaran",
          select: "_id kode nama sks kelas jurusan",
          model: "MataPelajaran",
        });

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data dashboard!",
        data: {
          alpa,
          hadir,
          izin,
          sakit,
          history,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  getDashboardOrangTua: async (req, res, next) => {
    try {
      const siswa = req.user.siswa.length;
      const alpa = await Absensi.countDocuments({
        siswa: {
          $in: req.user.siswa,
        },
        keterangan: "Alpa",
      });
      const hadir = await Absensi.countDocuments({
        siswa: {
          $in: req.user.siswa,
        },
        keterangan: "Hadir",
      });
      const izin = await Absensi.countDocuments({
        siswa: {
          $in: req.user.siswa,
        },
        keterangan: "Izin",
      });
      const sakit = await Absensi.countDocuments({
        siswa: {
          $in: req.user.siswa,
        },
        keterangan: "Sakit",
      });
      const absensi = await Absensi.find({ siswa: { $in: req.user.siswa } })
        .populate("mataPelajaran")
        .populate("siswa")
        .populate("guru");

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data dashboard!",
        data: {
          siswa,
          alpa,
          hadir,
          izin,
          sakit,
          absensi,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
