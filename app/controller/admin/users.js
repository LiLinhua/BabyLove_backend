'use strict';
const { v4: uuidv4 } = require('uuid');
const { Controller } = require('egg');
const bcrypt = require('bcryptjs');
const moment = require('moment');

class GoodsController extends Controller {
  /**
   * 登录
   * @return
   */
  async login() {
    const { ctx, app } = this;
    const { Op } = app.Sequelize;
    const { userName, userPassword } = ctx.request.body;

    // 参数验证
    if (!userName || !userPassword) {
      return ctx.helper.responseError({ message: '用户登录名或者密码不能为空' });
    }

    try {
      // 错误次数检查
      const errorCountCacheKey = `password_error_count-${userName}`;
      let errorCountCache = app.nodeCache.get(errorCountCacheKey);
      if (errorCountCache && errorCountCache >= 5) {
        return ctx.helper.responseError({ message: '密码错误次数过多，账号已被锁住' });
      }

      // 查询用户是否存在
      const user = await ctx.service.users.findOne({
        [Op.or]: [{
          userName,
        }, {
          userPhone: userName,
        }],
      }, {
        raw: true,
      });
      if (!user) {
        return ctx.helper.responseError({ message: '用户不存在或者已经被删除' });
      }

      // 密码校验
      if (!bcrypt.compareSync(userPassword, user.userPassword)) {
        if (!errorCountCache) {
          errorCountCache = 1;
        } else {
          errorCountCache++;
        }
        // 限定 10 分钟内只能输入 5 次错误密码
        app.nodeCache.set(errorCountCacheKey, errorCountCache, 600);
        return ctx.helper.responseError({ message: `密码错误，你还剩${5 - errorCountCache}次机会` });
      }

      ctx.service.users.login(ctx, user);
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 退出
   * @return
   */
  async logout() {
    const { ctx } = this;

    try {
      ctx.service.users.logout(ctx);
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 添加用户
   */
  async addUser() {
    const { ctx } = this;
    let { userName, userPassword, userPhone, userBirthday, userAddress, userWeddingDate, userFavorite, userOthers } = ctx.request.body;

    // 参数校验
    if (!userName) {
      return ctx.helper.responseError({ message: '用户登录名不能为空' });
    }
    if (!userPassword) {
      return ctx.helper.responseError({ message: '用户密码不能为空' });
    }
    if (userPassword.trim().length < 8) {
      return ctx.helper.responseError({ message: '用户密码不能少于 8 位' });
    }
    if (!userPhone) {
      return ctx.helper.responseError({ message: '用户手机号码不能为空' });
    }
    if (userPhone.trim().length !== 11 || isNaN(userPhone)) {
      return ctx.helper.responseError({ message: '用户手机号码只能是11位数字' });
    }
    if (userBirthday && !moment(userBirthday).isValid()) {
      return ctx.helper.responseError({ message: '用户出生日期格式不合法' });
    }
    if (userWeddingDate && !moment(userWeddingDate).isValid()) {
      return ctx.helper.responseError({ message: '用户结婚纪念日格式不合法' });
    }

    try {
      // 判断用户名是否存在
      let user = await ctx.service.users.findOne({ userName }, { attributes: [ 'userName' ], raw: true });
      if (user) {
        return ctx.helper.responseError({ message: '用户名已经存在' });
      }

      // 判断手机号是否存在
      user = await ctx.service.users.findOne({ userPhone }, { attributes: [ 'userPhone' ], raw: true });
      if (user) {
        return ctx.helper.responseError({ message: '手机号已经存在' });
      }

      // 创建用户
      userPassword = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(10));
      const result = await ctx.service.users.create({ userCode: uuidv4(), userName, userPassword, userPhone, userBirthday, userAddress, userWeddingDate, userFavorite, userOthers, isAdmin: 0 });

      // 响应前端
      return ctx.helper.responseSuccess({ data: result });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 更新用户
   */
  async updateUser() {
    const { ctx } = this;
    const { userCode, userName, userPassword, userPhone, userBirthday, userAddress, userWeddingDate, userFavorite, userOthers } = ctx.request.body;

    // 参数校验
    if (!userCode) {
      return ctx.helper.responseError({ message: '用户编码不能为空' });
    }
    if (typeof userPassword === 'string' && userPassword.trim().length < 8) {
      return ctx.helper.responseError({ message: '用户密码不能少于 8 位' });
    }
    if (typeof userPhone === 'string' && (userPhone.trim().length !== 11 || isNaN(userPhone))) {
      return ctx.helper.responseError({ message: '用户手机号码只能是11位数字' });
    }

    try {
      // 验证用户是否存在
      const user = await ctx.service.users.findOne({ userCode }, { raw: true });
      if (!user) {
        return ctx.helper.responseError({ message: '用户不存在或者已经被删除' });
      }

      // 验证用户名
      if (typeof userName === 'string' && userName.trim().length > 0) {
        user.userName = userName;
        const tempUser = await ctx.service.users.findOne({ userName }, { attributes: [ 'userCode' ], raw: true });
        if (tempUser && user.userCode !== tempUser.userCode) {
          return ctx.helper.responseError({ message: '用户名已经存在' });
        }
      }

      // 验证手机号
      if (typeof userPhone === 'string' && userPhone.trim().length === 11) {
        user.userPhone = userPhone;
        const tempUser = await ctx.service.users.findOne({ userPhone }, { attributes: [ 'userCode' ], raw: true });
        if (tempUser && user.userCode !== tempUser.userCode) {
          return ctx.helper.responseError({ message: '用户手机号已经存在' });
        }
      }

      // 加密密码
      if (typeof userPassword === 'string' && userPassword.trim().length > 0) {
        user.userPassword = bcrypt.hashSync(userPassword, bcrypt.genSaltSync(10));
      }

      // 补充参数
      if (userBirthday) {
        user.userBirthday = userBirthday;
      }
      if (userAddress) {
        user.userAddress = userAddress;
      }
      if (userWeddingDate) {
        user.userWeddingDate = userWeddingDate;
      }
      if (userFavorite) {
        user.userFavorite = userFavorite;
      }
      if (userOthers) {
        user.userOthers = userOthers;
      }

      // 更新用户信息
      await ctx.service.users.update(user, { userCode: user.userCode });

      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询用户列表
   */
  async queryAllUsers() {
    const { ctx } = this;
    const { Op } = ctx.model.Sequelize;
    let { keyword, userBirthdaySort, userWeddingDateSort } = ctx.request.query;
    if (keyword && typeof keyword === 'string') {
      keyword = keyword.trim();
    } else {
      keyword = '';
    }

    try {
      const like = { [Op.like]: '%' + keyword + '%' };
      const where = {
        [Op.or]: [
          { userName: like },
          { userCode: like },
          { userPhone: like },
          { userAddress: like },
          { userFavorite: like },
          { userOthers: like },
        ],
      };
      const order = [];
      if (userBirthdaySort) {
        order.push([ 'userBirthday', 'DESC' ]);
      }
      if (userWeddingDateSort) {
        order.push([ 'userWeddingDate', 'DESC' ]);
      }
      const data = await ctx.service.users.findAll(where, {
        attributes: {
          exclude: [ 'userPassword', 'deletedAt' ],
        },
        order,
        raw: true,
      });
      return ctx.helper.responseSuccess({ data });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 查询用户详情
   */
  async queryUserDetails() {
    const { ctx } = this;
    const { userCode } = ctx.request.body;
    if (!userCode) {
      return ctx.helper.responseError({ message: '用户编码不能为空' });
    }

    try {
      const data = await ctx.service.users.findOne({ userCode }, {
        attributes: {
          exclude: [ 'userPassword', 'deletedAt' ],
        },
        raw: true,
      });
      return ctx.helper.responseSuccess({ data });
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }

  /**
   * 删除用户
   */
  async removeUser() {
    const { ctx } = this;
    const { userCode } = ctx.request.body;

    // 参数校验
    if (!userCode) {
      return ctx.helper.responseError({ message: '用户编码不能为空' });
    }

    try {
      const user = await ctx.service.users.findOne({ userCode }, {
        attributes: [ 'userCode' ],
        raw: true,
      });

      if (!user) {
        return ctx.helper.responseError({ message: '用户不存在或者已经被删除' });
      }

      await ctx.service.users.destroy({ userCode });
      return ctx.helper.responseSuccess();
    } catch (error) {
      return ctx.helper.responseError({}, error);
    }
  }
}

module.exports = GoodsController;
