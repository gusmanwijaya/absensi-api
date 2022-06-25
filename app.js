const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const authRouter = require("./app/api/v1/routers/auth");
const kelasRouter = require("./app/api/v1/routers/kelas");
const jurusanRouter = require("./app/api/v1/routers/jurusan");
const mataPelajaranRouter = require("./app/api/v1/routers/mata-pelajaran");
const guruRouter = require("./app/api/v1/routers/guru");
const siswaRouter = require("./app/api/v1/routers/siswa");
const orangTuaRouter = require("./app/api/v1/routers/orang-tua");
const absensiRouter = require("./app/api/v1/routers/absensi");

const notFoundMiddleware = require("./app/middleware/not-found");
const handleErrorMiddleware = require("./app/middleware/handle-error");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const API_VERSION = "api/v1";

app.use(`/${API_VERSION}/auth`, authRouter);
app.use(`/${API_VERSION}/kelas`, kelasRouter);
app.use(`/${API_VERSION}/jurusan`, jurusanRouter);
app.use(`/${API_VERSION}/mata-pelajaran`, mataPelajaranRouter);
app.use(`/${API_VERSION}/guru`, guruRouter);
app.use(`/${API_VERSION}/siswa`, siswaRouter);
app.use(`/${API_VERSION}/orang-tua`, orangTuaRouter);
app.use(`/${API_VERSION}/absensi`, absensiRouter);

app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
