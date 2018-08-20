"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = getApp();
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        yuepay: [{ key: 'yve', value: "\u4F7F\u7528\u4F59\u989D\u8FDB\u884C\u652F\u4ED8" }],
        goodsList: [],
        confirm: false,
        isNeedLogistics: 0,
        allGoodsPrice: 0,
        yunPrice: 0,
        allGoodsAndYunPrice: 0,
        goodsJsonStr: "",
        orderType: "",
        hasNoCoupons: false,
        coupons: [],
        couponsMoney: 0,
        couponsId: null,
        couponsName: '请选择优惠券',
        balance: 0,
        balMoney: 0,
        inlineDescList: [{ key: '0', value: "\u5FEB\u9012\u914D\u9001" }, { key: '1', value: "\u4E0A\u95E8\u81EA\u63D0" }, { key: '2', value: "\u65E0\u987B\u914D\u9001" }],
        wuLiuName: "\u8BF7\u9009\u62E9\u914D\u9001\u65B9\u5F0F",
        inlineDescListValue: ['1']
    },
    onShow: function onShow() {
        var that = this;
        var shopList = [];
        if ("buyNow" == that.data.orderType) {
            var buyNowInfoMem = wx.getStorageSync('__buyNowInfo');
            if (buyNowInfoMem && buyNowInfoMem.shopList) {
                shopList = buyNowInfoMem.shopList;
            }
        } else {
            var shopCarInfoMem = wx.getStorageSync('__shopCarInfo');
            if (shopCarInfoMem && shopCarInfoMem.shopList) {
                shopList = shopCarInfoMem.shopList.filter(function (entity) {
                    return entity.active;
                });
            }
        }
        that.setData({ goodsList: shopList });
        that.getBalanceNumber();
        that.initShippingAddress();
    },
    onLoad: function onLoad(e) {
        var orderType = e.orderType;
        if (orderType) {
            this.setData({
                isNeedLogistics: 1,
                orderType: e.orderType
            });
        }
    },
    getBalanceNumber: function getBalanceNumber(e) {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].useramount, { token: token }).then(function (res) {
            if (res.code == 0) {
                //that.setData({balance: res.data.balance});
                that.setData({ balance: 120 });
            }
        });
        if (e) {
            var balance = that.data.balance;
            var alPrice = that.data.allGoodsPrice;
            var yuPrice = that.data.yunPrice;
            var cuMoney = that.data.couponsMoney;
            var allmoney = alPrice + yuPrice - cuMoney;
            if (allmoney >= 0) {
                var allmoney = alPrice + yuPrice - cuMoney;
            } else {
                var allmoney = 0;
            }
            if (allmoney == 0) {
                wx.showConfirm({
                    content: "\u5408\u8BA1\u91D1\u989D\u4E3A0\uFF0C\u4E0D\u80FD\u5728\u7528\u4F59\u989D\u62B5\u6263\u4E86",
                    showCancel: false,
                    confirmColor: '#ffd305',
                    confirmText: "\u6211\u77E5\u9053\u4E86",
                    success: function success(res) {}
                });
                return;
            } else {
                if (balance - allmoney >= 0) {
                    that.setData({ balMoney: allmoney });
                } else {
                    that.setData({ balMoney: balance });
                }
            }
        }
    },
    initShippingAddress: function initShippingAddress() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].addsdefault, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ curAddressData: res.data });
                that.processYunfei();
            } else {
                that.setData({ curAddressData: false });
                that.processYunfei();
            }
        });
    },
    processYunfei: function processYunfei() {
        var that = this;
        var goodsList = this.data.goodsList;
        var goodsJsonStr = "[";
        var isNeedLogistics = 0;
        var allGoodsPrice = 0;
        for (var i = 0; i < goodsList.length; i++) {
            var carShopBean = goodsList[i];
            if (carShopBean.logistics) {
                isNeedLogistics = 1;
            }
            allGoodsPrice += carShopBean.price * carShopBean.number;
            var goodsJsonStrTmp = '';
            if (i > 0) {
                goodsJsonStrTmp = ",";
            }
            var inviter_id = 0;
            var inviter_id_storge = wx.getStorageSync('inviter_id_' + carShopBean.goodsId);
            if (inviter_id_storge) {
                inviter_id = inviter_id_storge;
            }
            goodsJsonStrTmp += '{"goodsId":' + carShopBean.goodsId + ',"number":' + carShopBean.number + ',"propertyChildIds":"' + carShopBean.propertyChildIds + '","logisticsType":0, "inviter_id":' + inviter_id + '}';
            goodsJsonStr += goodsJsonStrTmp;
        }
        goodsJsonStr += "]";
        that.setData({
            isNeedLogistics: isNeedLogistics,
            goodsJsonStr: goodsJsonStr
        });
        that.createOrder();
    },
    createOrder: function createOrder(e) {
        var that = this;
        var loginToken = wx.getStorageSync('__appUserInfo').token;
        var remark = "";
        if (e) {
            remark = e.detail.value.remark;
        }
        var postData = {
            viewid: 'home',
            part: 'order_create',
            token: loginToken,
            goodsJsonStr: that.data.goodsJsonStr,
            remark: remark
        };
        if (that.data.isNeedLogistics > 0) {
            if (!that.data.curAddressData) {
                wx.showConfirm({
                    content: "\u8BF7\u5148\u8BBE\u7F6E\u60A8\u7684\u6536\u8D27\u5730\u5740\uFF01",
                    cancelColor: "#999999",
                    confirmColor: "#ffd305",
                    confirmText: "\u7ACB\u5373\u8BBE\u7F6E",
                    cancelText: "\u7A0D\u540E\u8BBE\u7F6E",
                    success: function success(res) {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: "/pages/pages/user/address/address"
                            });
                        }
                    }
                });
                return;
            }
            postData.provinceId = that.data.curAddressData.provinceId;
            postData.cityId = that.data.curAddressData.cityId;
            if (that.data.curAddressData.districtId) {
                postData.districtId = that.data.curAddressData.districtId;
            }
            postData.address = that.data.curAddressData.address;
            postData.linkMan = that.data.curAddressData.linkMan;
            postData.mobile = that.data.curAddressData.mobile;
            postData.code = that.data.curAddressData.code;
        }
        if (that.data.couponsId != 0) {
            postData.couponId = that.data.couponsId;
        } else {
            postData.couponId = null;
        }
        if (!e) {
            postData.calculate = "true";
        }
        _server2.default.post(_urls2.default.links[0].ordercreate, postData).then(function (res) {
            console.log('aa', res);
            if (res.code == 0) {
                if (e && "buyNow" != that.data.orderType) {
                    wx.removeStorageSync('__shopCarInfo');
                }
                if (!e) {
                    that.setData({
                        isNeedLogistics: res.data.isNeedLogistics,
                        allGoodsPrice: res.data.amountTotle,
                        allGoodsAndYunPrice: res.data.amountLogistics + res.data.amountTotle,
                        yunPrice: res.data.amountLogistics
                    });
                    that.getMyCoupons();
                    return;
                }
                console.log(res);
                wx.redirectTo({
                    url: "/pages/pages/payorder/paypal/paypal"
                });
            }
        });
    },
    getMyCoupons: function getMyCoupons() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mydiscounts, { token: token, status: 0 }).then(function (res) {
            if (res.code == 0) {
                var coupons = res.data.filter(function (entity) {
                    return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
                });
                if (coupons.length > 0) {
                    that.setData({
                        hasNoCoupons: true,
                        coupons: coupons
                    });
                }
            }
        });
    },
    addschange: function addschange(e) {
        var that = this;
        var val = e.detail.value;
        var list = that.data.inlineDescList;
        that.setData({ wuLiuName: list[val].value });
    },
    change: function change(e) {
        var that = this;
        var val = e.detail.value[0];
        if (val == 'yve') {
            that.setData({ yveMoney: val });
            that.getBalanceNumber(val);
        } else {
            that.setData({ yveMoney: null, balMoney: 0 });
        }
    },
    bindChangeCoupon: function bindChangeCoupon(e) {
        var that = this;
        var id = e.currentTarget.dataset.id;
        var name = e.currentTarget.dataset.name;
        var money = e.currentTarget.dataset.money;
        that.setData({ couponsName: name, couponsId: id, couponsMoney: money });
    },
    bindCancelCoupon: function bindCancelCoupon() {
        var that = this;
        that.setData({ couponsName: '请选择优惠券', couponsId: null, couponsMoney: 0 });
    },
    getPayPalTap: function getPayPalTap() {
        wx.navigateTo({
            url: "/pages/pages/user/paypal/paypal"
        });
    },
    getAddressTap: function getAddressTap() {
        wx.navigateTo({
            url: "/pages/pages/user/address/address"
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});