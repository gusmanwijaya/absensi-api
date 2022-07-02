const Absensi = require("../models/absensi");
const MataPelajaran = require("../models/mata-pelajaran");
const Siswa = require("../models/siswa");
const Guru = require("../models/guru");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");
const moment = require("moment");

module.exports = {
  getMataPelajaran: async (req, res, next) => {
    try {
      const data = await MataPelajaran.find({
        _id: { $in: req.user.mataPelajaran },
      })
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

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data mata pelajaran",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getSiswa: async (req, res, next) => {
    try {
      const { id: mataPelajaranId } = req.params;

      const data = await Siswa.find({ mataPelajaran: mataPelajaranId })
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
      const { tanggal, mataPelajaran, siswa, guru, keterangan } = req.body;

      const tanggalNow = `${moment().get("date")}-${
        moment().get("month") + 1
      }-${moment().get("year")}`;

      if (tanggal !== tanggalNow)
        throw new CustomError.BadRequest("Tanggal absensi bukan hari ini!");

      const absensi = await Absensi.find({ mataPelajaran, guru })
        .select("pertemuan")
        .sort({ pertemuan: -1 });

      if (absensi[0]?.pertemuan > 16)
        throw new CustomError.BadRequest("Pertemuan sudah lebih dari 16!");

      let _temp = [];
      const parseSiswa = JSON.parse(siswa);
      const parseKeterangan = JSON.parse(keterangan);

      if (parseSiswa.length < 1 && parseKeterangan.length < 1)
        throw new CustomError.BadRequest("Siswa dan keterangan kosong!");

      for (let index = 0; index < parseSiswa.length; index++) {
        _temp.push({
          tanggal: tanggalNow,
          pertemuan: absensi[0]?.pertemuan > 0 ? absensi[0]?.pertemuan + 1 : 1,
          mataPelajaran,
          siswa: parseSiswa[index],
          guru: req.user.role === "guru" ? req.user._id : guru,
          keterangan: parseKeterangan[index],
        });
      }

      const absensiToday = await Absensi.find({
        mataPelajaran,
        guru,
        tanggal: tanggalNow,
      }).populate({
        path: "mataPelajaran",
        model: "MataPelajaran",
      });

      if (absensiToday.length > 0)
        throw new CustomError.BadRequest(
          `Anda sudah melakukan absensi untuk mata pelajaran ${absensiToday[0]?.mataPelajaran?.nama} hari ini!`
        );

      const data = await Absensi.insertMany(_temp);

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Data absensi berhasil ditambahkan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  qrCode: async (req, res, next) => {
    try {
      const { tanggal, mataPelajaran, siswa } = req.query;

      if (!tanggal || !mataPelajaran || !siswa)
        throw new CustomError.BadRequest(
          "Query tanggal, mata pelajaran, atau siswa tidak boleh kosong!"
        );

      const tanggalNow = `${moment().get("date")}-${
        moment().get("month") + 1
      }-${moment().get("year")}`;

      if (tanggal !== tanggalNow)
        throw new CustomError.BadRequest("Tanggal absensi bukan hari ini!");

      const absensi = await Absensi.find({ mataPelajaran })
        .select("pertemuan")
        .sort({ pertemuan: -1 });

      if (absensi[0]?.pertemuan > 16)
        throw new CustomError.BadRequest("Pertemuan sudah lebih dari 16!");

      const absensiToday = await Absensi.find({
        mataPelajaran,
        siswa,
        tanggal: tanggalNow,
      }).populate({
        path: "mataPelajaran",
        model: "MataPelajaran",
      });

      if (absensiToday.length > 0)
        throw new CustomError.BadRequest(
          `Anda sudah melakukan absensi untuk mata pelajaran ${absensiToday[0]?.mataPelajaran?.nama} hari ini!`
        );

      const dataGuru = await Guru.findOne({ mataPelajaran });

      const data = await Absensi.create({
        tanggal: tanggalNow,
        mataPelajaran,
        siswa,
        guru: dataGuru?._id,
        keterangan: "Hadir",
      });

      res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: "Berhasil melakukan absen hari ini!",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getAbsensiToday: async (req, res, next) => {
    try {
      const { id: idMataPelajaran } = req.params;

      let data;
      if (req.user.role === "guru") {
        data = await Absensi.find({
          mataPelajaran: idMataPelajaran,
          tanggal: `${moment().get("date")}-${
            moment().get("month") + 1
          }-${moment().get("year")}`,
          guru: req.user._id,
        });
      } else if (req.user.role === "siswa") {
        data = await Absensi.find({
          mataPelajaran: idMataPelajaran,
          tanggal: `${moment().get("date")}-${
            moment().get("month") + 1
          }-${moment().get("year")}`,
          siswa: req.user._id,
        });
      }

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data absensi hari ini",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getPertemuan: async (req, res, next) => {
    try {
      const { id: idMataPelajaran } = req.params;

      let response;
      if (req.user.role === "guru") {
        response = await Absensi.find({
          mataPelajaran: idMataPelajaran,
          guru: req.user._id,
        }).select("_id pertemuan");
      } else if (req.user.role === "siswa") {
        response = await Absensi.find({
          mataPelajaran: idMataPelajaran,
          siswa: req.user._id,
        }).select("_id pertemuan");
      }

      let _temp = [];
      response.forEach((element) => {
        _temp.push(element?.pertemuan);
      });

      let data = [...new Set(_temp)];

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data pertemuan",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
  getAllAbsensi: async (req, res, next) => {
    try {
      const { id: idMataPelajaran } = req.params;
      const { query } = req.query;

      const data = await Absensi.find({
        mataPelajaran: idMataPelajaran,
        guru: req.user._id,
        pertemuan: parseInt(query),
      })
        .select("_id tanggal pertemuan mataPelajaran siswa guru keterangan")
        .populate({
          path: "mataPelajaran",
          model: "MataPelajaran",
        })
        .populate({
          path: "siswa",
          model: "Siswa",
        })
        .populate({
          path: "guru",
          model: "Guru",
        });

      res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "Berhasil mendapatkan data absensi",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
