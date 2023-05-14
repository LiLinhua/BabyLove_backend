'use strict';
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Service = require('egg').Service;

class UploadService extends Service {
  uploadPicture(file, dir = '') {
    if (!file) {
      return { success: false, message: '上传图片不能为空' };
    }

    // 读取文件
    const fileContent = fs.readFileSync(file.filepath);

    // 数量文件信息
    const { pictureFullDir, pictureDir } = this.config.upload;
    const fileCode = uuidv4();
    const fileName = fileCode + '_' + moment().format('YYYYMMDDHHmmss') + path.extname(file.filename);
    const filePath = pictureDir + '/' + dir + '/' + fileName;
    const fileFullPath = pictureFullDir + '/' + dir + '/' + fileName;

    // 创建文件目录
    if (!fs.existsSync(pictureFullDir + '/' + dir)) {
      fs.mkdirSync(pictureFullDir + '/' + dir);
    }

    // 写入文件
    fs.writeFileSync(fileFullPath, fileContent);

    return { success: true, fileCode, fileName, filePath, fileFullPath };
  }
}

module.exports = UploadService;
