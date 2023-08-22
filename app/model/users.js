'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Users = app.model.define('users', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    userCode: { field: 'user_code', type: STRING(50), allowNull: false, comment: '用户唯一编码' },
    userName: { field: 'user_name', type: STRING(50), allowNull: false, comment: '用户名' },
    userNickname: { field: 'user_nickname', type: STRING(50), allowNull: true, comment: '用户姓名' },
    userPassword: { field: 'user_password', type: STRING(255), allowNull: false, comment: '用户密码' },
    userPhone: { field: 'user_phone', type: STRING(11), allowNull: true, comment: '用户手机号' },
    userBirthday: { field: 'user_birthday', type: DATE, allowNull: true, comment: '用户生日' },
    userAddress: { field: 'user_address', type: STRING(255), allowNull: true, comment: '用户住址' },
    userWeddingDate: { field: 'user_wedding_date', type: DATE, allowNull: true, comment: '用户结婚纪念日' },
    userFavorite: { field: 'user_favorite', type: STRING(500), allowNull: true, comment: '用户喜好' },
    userOthers: { field: 'user_others', type: STRING(500), allowNull: true, comment: '用户其他信息' },
    isAdmin: { field: 'is_admin', type: INTEGER, allowNull: false, default: 0, comment: '是否是系统管理员' },
    createdAt: { field: 'created_at', type: DATE, allowNull: false, comment: '创建时间' },
    updatedAt: { field: 'updated_at', type: DATE, allowNull: false, comment: '更新时间' },
    deletedAt: { field: 'deleted_at', type: DATE, allowNull: true, comment: '删除时间' },
  }, {
    timestamp: true,
    paranoid: true,
  });
  return Users;
};
