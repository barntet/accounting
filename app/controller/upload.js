"use strict";

const fs = require("fs");
const moment = require("moment");
const mkdirp = require("mkdirp");
const path = require("path");
const qiniu = require("qiniu");

const Controller = require("egg").Controller;

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    // 需要前往 config/config.default.js设置config.multipart的mode属性为file
    const file = ctx.request.files[0];
    console.log(file);
    //  声明存放资源的路径
    let uploadDir = "";

    //     try {
    //       const f = fs.readFileSync(file.filepath);
    //       console.log(f);
    //       // 获取当前日期
    //       const day = moment(new Date()).format("YYYYMMDD");
    //       // 创建图片保存路径
    //       const dir = path.join(this.config.uploadDir, day); // this.config.uploadDir 是需要在config/config.default.js声明才能全局使用 const userConfig={upladDir:'app/public/upload'}
    //       const date = Date.now();
    //       await mkdirp(dir); // 目录不存在则创建

    //       console.log("path", path.extname(file.filename));
    //       // 返回图片的保存路径
    //       uploadDir = path.join(dir, date + path.extname(file.filename));
    //       console.log(uploadDir);
    //       // 写入文件夹
    //       fs.writeFileSync(uploadDir, f);
    //     } finally {
    //       // 清理临时文件
    //       ctx.cleanupRequestFiles();
    //     }
    const accessKey = "Won0bhwsMwhiN_ppF94KPq2Ni7w5uh4XSJs7O_VN";
    const secreyKey = "t-AkMCpNvMkwFq4Z2_ZNe8TlWU10IAQxpy2ogH-F";

    try {
      uploadDir = new qiniu.auth.digest.Mac(accessKey, secreyKey);
    } catch (error) {
      console.log(error);
    }
    ctx.body = {
      code: 200,
      msg: "success",
      data: uploadDir.replace("/app/g", ""),
    };
  }
}

module.exports = UploadController;
