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
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    swiperCurrent: 0,
    pics: {},
    showMask: false
  },
  onShow: function onShow() {
    var that = this;
    setTimeout(function () {
      if (app.globalData.userinfo == 1e4) {
        that.setData({ showMask: true });
      }
    }, 800);
  },
  onLoad: function onLoad() {
    var that = this;
    wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
    _server2.default.get(_urls2.default.links[0].banner, { type: "toplogo" }).then(function (res) {
      if (res.code == 0) {
        that.setData({ toplogo: res.data[0].picUrl, topname: res.data[0].title });
      }
    });
    _server2.default.get(_urls2.default.links[0].banner, { type: "home" }).then(function (res) {
      if (res.code == 0) {
        wx.hideLoading();
        that.setData({ home: res.data });
      }
    });
    _server2.default.get(_urls2.default.links[0].config, { key: "toptuan" }).then(function (res) {
      if (res.code == 0) {
        _server2.default.get(_urls2.default.links[0].banner, { type: "toptuan" }).then(function (res) {
          if (res.code == 0) {
            that.setData({ toptuan: res.data });
          }
        });
        that.setData({ toptuaninfo: res.data });
      }
    });
    _server2.default.get(_urls2.default.links[0].config, { key: "topgoods" }).then(function (res) {
      if (res.code == 0) {
        _server2.default.get(_urls2.default.links[0].glist, { recommendStatus: 1, pageSize: 20 }).then(function (res) {
          if (res.code == 0) {
            var goods = [];
            for (var i = 0; i < res.data.length; i++) {
              goods.push(res.data[i]);
            }
            that.setData({ goods: goods });
          }
        });
        that.setData({ topgoods: res.data });
      }
    });
  },
  userlogin: function userlogin(e) {
    var that = this;
    var iv = e.detail.iv;
    var rawData = e.detail.rawData;
    var signature = e.detail.signature;
    var encryptedData = e.detail.encryptedData;
    wx.login({
      success: function success(wxs) {
        _server2.default.get(_urls2.default.links[0].wxregister, { iv: iv, code: wxs.code, rawData: rawData, signature: signature, encryptedData: encryptedData }).then(function (res) {
          if (res.code != 0) {
            wx.showConfirm({
              content: "\u9700\u8981\u60A8\u7684\u6388\u6743\uFF0C\u624D\u80FD\u6B63\u5E38\u4F7F\u7528\u54E6\uFF5E",
              showCancel: false,
              confirmColor: '#ffd305',
              confirmText: "\u91CD\u65B0\u6388\u6743",
              success: function success(res) {}
            });
            return;
          } else {
            that.setData({ showMask: false });
            app.login();
            wx.showToast({ title: "\u5FAE\u4FE1\u6388\u6743\u6210\u529F", icon: 'none' });
            app.globalData.userinfo = 0;
          }
        });
      }
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  getkangoods: function getkangoods(e) {
    var that = this;
    var pics = that.data.pics;
    _server2.default.get(_urls2.default.links[0].kanjialist, {}).then(function (res) {
      if (res.code == 0) {
        var result = res.result;
        for (var i = 0; i < result.length; i++) {
          if (e == result[i].goodsId) {
            pics[e] = result[i];
          }
        }
        that.setData({ pics: pics });
      }
    });
  },
  onPageScroll: function onPageScroll(t) {
    if (t.scrollTop >= 280) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: "scrollTop"
      });
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff'
      });
      this.setData({
        navigationbar: ""
      });
    }
  },
  toDetailsTap: function toDetailsTap(e) {
    wx.navigateTo({
      url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
    });
  },
  toTopic: function toTopic(e) {
    wx.navigateTo({
      url: "/pages/pages/topic/index?id=" + e.currentTarget.dataset.id
    });
  },
  tapBanner: function tapBanner(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/pages/goods/goods?id=" + e.currentTarget.dataset.id
      });
    }
  },
  kanjiaTap: function kanjiaTap(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/pages/kanjia-goods/index?id=" + e.currentTarget.dataset.id
      });
    }
  },
  tapSales: function tapSales(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: e.currentTarget.dataset.id
      });
    }
  }

});