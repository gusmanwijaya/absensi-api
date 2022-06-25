const Absensi = require("../models/absensi");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../../../error");
const moment = require("moment");

module.exports = {
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
};
