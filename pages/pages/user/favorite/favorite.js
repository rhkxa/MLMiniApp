"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _utils = require("../../../modules/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        favtime: {},
        goods: {}
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].favlist, { token: token }).then(function (res) {
            if (res.code == 0) {
                for (var i = 0; i < res.data.length; i++) {
                    that.getGoodsInfo(res.data[i].goodsId);
                    that.getFavtimes(res.data[i].dateAdd, res.data[i].id);
                }
                that.setData({ favoriteList: res.data });
            } else {
                that.setData({ favoriteList: '' });
            }
        });
    },
    getFavtimes: function getFavtimes(e, id) {
        var that = this;
        var time = e,
            ftim = time.replace(/-/g, '/'),
            times = Date.parse(new Date(ftim)) / 1000;
        var favtime = that.data.favtime;
        favtime[id] = _utils2.default.formatTime(times, 'D/M/Y');
        that.setData({ favtime: favtime });
    },
    getGoodsInfo: function getGoodsInfo(e) {
        var that = this;
        var goods = that.data.goods;
        _server2.default.get(_urls2.default.links[0].gdetail, { id: e }).then(function (res) {
            if (res.code == 0) {
                goods[e] = res.data.basicInfo;
                that.setData({ goods: goods });
            }
        });
    },
    goodsTap: function goodsTap(e) {
        wx.navigateTo({
            url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});