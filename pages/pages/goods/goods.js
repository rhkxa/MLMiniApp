"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _data;

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _utils = require("../../modules/utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

var _wxParse = require("../../../static/wxParse/wxParse.js");

var _wxParse2 = _interopRequireDefault(_wxParse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var app = getApp();
exports.default = Page({
  data: (_data = {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    width: wx.WIN_WIDTH,
    current: 0,
    value: 0,
    show: false,
    show1: true,
    show2: false,
    shopNum: 0,
    scrollTop: 0,
    favicon: 0,
    goodsDetail: {},
    swiperCurrent: 0
  }, _defineProperty(_data, "width", wx.WIN_WIDTH), _defineProperty(_data, "selectptPrice", 0), _defineProperty(_data, "propertyChildIds", ""), _defineProperty(_data, "propertyChildNames", ""), _defineProperty(_data, "canSubmit", false), _defineProperty(_data, "shopCarInfo", {}), _defineProperty(_data, "shopType", "addShopCar"), _defineProperty(_data, "customStyle", {
    'width': '100%',
    'color': '#27323f',
    'background-color': '#ffd305',
    'display': 'block',
    'margin-top': '-30rpx',
    'font-size': '20rpx',
    'padding': '0 12rpx 0 10rpx'
  }), _defineProperty(_data, "cartStyle", {
    'position': 'absolute',
    'top': '14rpx',
    'font-size': '22rpx',
    'color': '#27323f',
    'background-color': '#ffd305'
  }), _defineProperty(_data, "activeTabStyle", {
    'color': '#ffd305 !important',
    'border-bottom': '1px solid #ffd305',
    'width': '100% !important'
  }), _data),
  onLoad: function onLoad(e) {
    var that = this;
    if (!e.scene) {
      if (e.inviter_id) {
        wx.setStorage({
          key: 'inviter_id_' + e.id,
          data: e.inviter_id
        });
      }
      if (e.share) {
        that.setData({ share: e.share });
      }
      that.setData({ id: e.id });
    }
    if (!e.id) {
      var scene = decodeURIComponent(e.scene);
      if (scene.length > 0 && scene != undefined) {
        var scarr = scene.split(',');
        var dilist = [];
        for (var i = 0; i < scarr.length; i++) {
          dilist.push(scarr[i].split('='));
        }
        if (dilist.length > 0) {
          var dict = {};
          for (var j = 0; j < dilist.length; j++) {
            dict[dilist[j][0]] = dilist[j][1];
          }
          var id = dict.i;
          var vid = dict.u;
          var sid = dict.s;
          that.setData({ id: id });
          if (vid) {
            wx.setStorage({
              key: 'inviter_id_' + id,
              data: vid
            });
          }
          if (sid) {
            that.setData({ share: sid });
          }
        }
      }
    }
    that.getfav();
    wx.getStorage({
      key: '__shopCarInfo',
      success: function success(res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    });
    _server2.default.get(_urls2.default.links[0].gdetail, { id: that.data.id }).then(function (res) {
      if (res.code == 0) {
        var selectSizeTemp = "";
        if (res.data.properties) {
          for (var i = 0; i < res.data.properties.length; i++) {
            selectSizeTemp = selectSizeTemp + " " + res.data.properties[i].name;
          }
          that.setData({
            hasMoreSelect: true,
            selectSize: that.data.selectSize + selectSizeTemp,
            selectSizePrice: res.data.basicInfo.minPrice,
            selectptPrice: res.data.basicInfo.ptprice
          });
        }
        that.data.goodsDetail = res;
        if (res.data.basicInfo.videoId) {
          that.getVideoSrc(res.data.basicInfo.videoId);
        }
        that.setData({
          goodsDetail: res.data,
          picsnumber: res.data.pics.length,
          selectSizePrice: res.data.basicInfo.minPrice,
          buyNumMax: res.data.basicInfo.stores,
          buyNumber: res.data.basicInfo.stores > 0 ? 1 : 0,
          selectptPrice: res.data.basicInfo.ptprice
        });
        _wxParse2.default.wxParse('content', 'html', res.data.content, that, 5);
      }
    });
    that.reputation(that.data.id);
  },
  labelItemTap: function labelItemTap(e) {
    var that = this;
    var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
    for (var i = 0; i < childs.length; i++) {
      that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }
    that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
    var needSelectNum = that.data.goodsDetail.properties.length;
    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    for (var i = 0; i < that.data.goodsDetail.properties.length; i++) {
      childs = that.data.goodsDetail.properties[i].childsCurGoods;
      for (var j = 0; j < childs.length; j++) {
        if (childs[j].active) {
          curSelectNum++;
          propertyChildIds = propertyChildIds + childs[j].id + ",";
          propertyChildNames = propertyChildNames + childs[j].name + "  ";
        }
      }
    }
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    if (canSubmit) {
      _server2.default.get(_urls2.default.links[0].gprice, { goodsId: that.data.goodsDetail.basicInfo.id, propertyChildIds: propertyChildIds }).then(function (res) {
        that.setData({
          selectSizePrice: res.data.price,
          propertyChildIds: propertyChildIds,
          propertyChildNames: propertyChildNames,
          buyNumMax: res.data.stores,
          buyNumber: res.data.stores > 0 ? 1 : 0
        });
      });
    }
    that.setData({
      goodsDetail: that.data.goodsDetail,
      canSubmit: canSubmit,
      propertyChildNames: propertyChildNames
    });
  },
  reputation: function reputation(goodsId) {
    var _this = this;

    _server2.default.get(_urls2.default.links[0].greputation, { goodsId: goodsId }).then(function (res) {
      if (res.code == 0) {
        _this.setData({ reputation: res.data });
      } else {
        _this.setData({ reputation: "" });
      }
    });
  },
  onPageScroll: function onPageScroll(t) {
    this.setData({ scrollTop: t.scrollTop });
    if (t.scrollTop >= 220) {
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
  addShopCar: function addShopCar() {
    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u9009\u62E9\u5546\u54C1\u89C4\u683C\uFF01",
          showCancel: false
        });
      }
      return;
    }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u8D2D\u4E70\u6570\u91CF\u4E0D\u80FD\u4E3A0\uFF01",
        showCancel: false
      });
      return;
    }
    var shopCarInfo = this.bulidShopCarInfo();
    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum,
      show: false
    });
    wx.setStorage({
      key: "__shopCarInfo",
      data: shopCarInfo
    });
    wx.showToast({
      title: "\u52A0\u5165\u8D2D\u7269\u8F66\u6210\u529F",
      icon: 'success',
      duration: 2000
    });
  },
  buyNow: function buyNow() {
    var that = this;
    if (that.data.goodsDetail.properties && !that.data.canSubmit) {
      wx.hideLoading();
      if (!that.data.canSubmit) {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u8BF7\u9009\u62E9\u5546\u54C1\u89C4\u683C\uFF01",
          showCancel: false
        });
      }
      that.bindGuiGeTap();
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u8BF7\u5148\u9009\u62E9\u89C4\u683C\u5C3A\u5BF8\u54E6~",
        showCancel: false
      });
      return;
    }
    if (that.data.buyNumber < 1) {
      wx.hideLoading();
      wx.showModal({
        title: "\u63D0\u793A",
        content: "\u8D2D\u4E70\u6570\u91CF\u4E0D\u80FD\u4E3A0\uFF01",
        showCancel: false
      });
      return;
    }
    setTimeout(function () {
      wx.hideLoading();
      var buyNowInfo = that.buliduBuyNowInfo();
      that.setData({ show: false });
      wx.setStorage({
        key: "__buyNowInfo",
        data: buyNowInfo
      });
      wx.navigateTo({
        url: "/pages/pages/payorder/payorder?orderType=buyNow"
      });
    }, 1000);
    wx.showLoading({
      title: '商品准备中...'
    });
  },
  buliduBuyNowInfo: function buliduBuyNowInfo() {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
    var buyNowInfo = {};
    if (!buyNowInfo.shopNum) {
      buyNowInfo.shopNum = 0;
    }
    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    return buyNowInfo;
  },
  bulidHistoryInfo: function bulidHistoryInfo() {
    var HistoryInfo = [];
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log(_utils2.default.formatTime(timestamp, 'Y-M-D'));
  },
  bulidShopCarInfo: function bulidShopCarInfo() {
    var shopCarMap = {};
    shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
    shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
    shopCarMap.name = this.data.goodsDetail.basicInfo.name;
    shopCarMap.propertyChildIds = this.data.propertyChildIds;
    shopCarMap.label = this.data.propertyChildNames;
    shopCarMap.price = this.data.selectSizePrice;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.number = this.data.buyNumber;
    shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
    shopCarMap.logistics = this.data.goodsDetail.logistics;
    shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;
    var shopCarInfo = this.data.shopCarInfo;
    if (!shopCarInfo.shopNum) {
      shopCarInfo.shopNum = 0;
    }
    if (!shopCarInfo.shopList) {
      shopCarInfo.shopList = [];
    }
    var hasSameGoodsIndex = -1;
    for (var i = 0; i < shopCarInfo.shopList.length; i++) {
      var tmpShopCarMap = shopCarInfo.shopList[i];
      if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
        hasSameGoodsIndex = i;
        shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
        break;
      }
    }
    shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
    if (hasSameGoodsIndex > -1) {
      shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
    } else {
      shopCarInfo.shopList.push(shopCarMap);
    }
    return shopCarInfo;
  },
  numJiaTap: function numJiaTap(e) {
    var val = e.detail;
    this.setData({ buyNumber: val });
  },
  getfav: function getfav() {
    var that = this;
    var id = that.data.id;
    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favlist, { token: token }).then(function (res) {
      if (res.code == 0) {
        if (res.data.length) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].goodsId == parseInt(id)) {
              that.setData({ favicon: 1 });
              break;
            }
          }
        }
      }
    });
  },
  fav: function fav() {
    var _this2 = this;

    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favadd, { goodsId: this.data.id, token: token }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "\u6536\u85CF\u6210\u529F",
          icon: 'success',
          image: '../../../images/active.png',
          duration: 2000
        });
        _this2.setData({ favicon: 1 });
      }
    });
  },
  del: function del() {
    var _this3 = this;

    var token = wx.getStorageSync('__appUserInfo').token;
    _server2.default.get(_urls2.default.links[0].favdelete, { goodsId: this.data.id, token: token }).then(function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: "\u53D6\u6D88\u6536\u85CF",
          icon: 'success',
          image: '../../../images/error.png',
          duration: 2000
        });
        _this3.setData({ favicon: 0 });
      }
    });
  },
  swiperChange: function swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    });
  },
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },
  handleChange: function handleChange(e) {
    var index = e.detail.index;
    if (index) {
      this.setData({
        show1: false,
        show2: true
      });
    } else {
      this.setData({
        show1: true,
        show2: false
      });
    }
  },
  openPopup: function openPopup(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      show: show
    });
  },

  toAddShopCar: function toAddShopCar() {
    this.setData({
      shopType: "addShopCar",
      show: true
    });
  },
  tobuy: function tobuy() {
    this.setData({
      shopType: "tobuy",
      show: true
    });
  },
  goShopCar: function goShopCar() {
    wx.reLaunch({
      url: "/pages/pages/shopcart/shopcart"
    });
  }
});