CREATE DATABASE `baby_love`;

USE `baby_love`;

CREATE TABLE `goods` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `goods_code` varchar(50) NOT NULL COMMENT '商品编码',
  `goods_title` varchar(500) NOT NULL COMMENT '商品标题',
  `goods_subtitle` varchar(500) DEFAULT NULL COMMENT '商品副标题',
  `goods_details` longtext COMMENT '商品详情',
  `goods_price` double NOT NULL COMMENT '商品价格',
  `goods_origin_price` double NOT NULL COMMENT '商品原价',
  `goods_catalog` varchar(50) NOT NULL COMMENT '商品种类',
  `goods_inventory` int(11) NOT NULL DEFAULT '0' COMMENT '商品库存',
  `goods_status` varchar(50) DEFAULT 'NORMAL' COMMENT '商品状态，NORMAL（正常的）、OFFLINE（已下架）',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `goods_catalogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catalog_code` varchar(45) NOT NULL COMMENT '分类编码',
  `catalog_name` varchar(255) NOT NULL COMMENT '分类名',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` varchar(45) DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `goods_pictures` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `picture_code` varchar(50) NOT NULL COMMENT '商品图片编码',
  `picture_url` longtext NOT NULL COMMENT '商品图片地址',
  `picture_content` longtext COMMENT '商品图片内容',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `goods_pictures_relations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `picture_code` varchar(50) NOT NULL COMMENT '商品图片编码',
  `goods_code` varchar(50) NOT NULL COMMENT '商品编码',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `goods_shopping_carts_relations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商品与购物车关联表',
  `goods_code` varchar(50) NOT NULL COMMENT '购物车编码',
  `shopping_cart_code` varchar(50) NOT NULL COMMENT '购物车编码',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `buy_count` int(11) NOT NULL DEFAULT '1' COMMENT '购买数量',
  `selected` int(11) NOT NULL DEFAULT '0' COMMENT '是否选择',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) NOT NULL COMMENT '订单编码',
  `shopping_cart_code` varchar(50) NOT NULL COMMENT '购物车编码',
  `user_code` varchar(50) DEFAULT NULL COMMENT '用户编码',
  `total_price` double NOT NULL COMMENT '订单总价',
  `total_count` int(11) NOT NULL COMMENT '购买商品总数量',
  `express_way` varchar(50) DEFAULT NULL COMMENT '配送方式',
  `express_code` varchar(50) DEFAULT NULL COMMENT '物流编码',
  `express_address` varchar(255) DEFAULT NULL COMMENT '配送地址',
  `status` varchar(45) NOT NULL DEFAULT 'WAIT_PAY' COMMENT '订单状态，待付款（WAIT_PAY）、待发货（WAIT_SEND）、待收货（WAIT_GET）、已完成（FINISHED）和已取消（CANCELED）共5种状态',
  `pay_way` varchar(50) NOT NULL DEFAULT 'USER_BALANCE' COMMENT '支付方式，可选值：USER_BALANCE（用户余额），CASH（现金），ALIPAY（支付宝），WECHAT（微信）',
  `user_signature` longtext COMMENT '用户签名',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `orders_goods_relations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_code` varchar(50) NOT NULL COMMENT '订单编码',
  `goods_code` varchar(50) NOT NULL COMMENT '商品编码',
  `shopping_cart_code` varchar(50) NOT NULL COMMENT '购物车编码',
  `goods_price` double NOT NULL COMMENT '商品价格',
  `buy_count` int(11) NOT NULL COMMENT '购买数量',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `shopping_carts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '购物车',
  `shopping_cart_code` varchar(50) NOT NULL COMMENT '购物车编码',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_code` varchar(50) NOT NULL COMMENT '用户唯一编码',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `user_nickname` varchar(50) DEFAULT NULL COMMENT '用户姓名',
  `user_password` varchar(255) NOT NULL COMMENT '用户密码',
  `user_phone` varchar(11) NOT NULL COMMENT '用户手机号',
  `user_birthday` datetime DEFAULT NULL COMMENT '用户生日',
  `user_address` varchar(255) DEFAULT NULL COMMENT '用户住址',
  `user_wedding_date` datetime DEFAULT NULL COMMENT '用户结婚纪念日',
  `user_favorite` varchar(500) DEFAULT NULL COMMENT '用户喜好',
  `user_others` varchar(1000) DEFAULT NULL COMMENT '用户其他情况',
  `user_balance` double DEFAULT '0' COMMENT '用户账号余额',
  `is_admin` int(11) NOT NULL DEFAULT '0' COMMENT '是否是系统管理员',
  `updated_at` datetime NOT NULL COMMENT '更新时间',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_phone_UNIQUE` (`user_phone`),
  UNIQUE KEY `username_UNIQUE` (`user_name`),
  UNIQUE KEY `user_code_UNIQUE` (`user_code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;