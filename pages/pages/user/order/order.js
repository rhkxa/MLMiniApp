"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.DEFAULT_HEADER_HEIGHT,
        current: 0
    },
    onLoad: function onLoad(e) {
        var that = this;
        that.handleChangeBtn(e);
    },
    getOrderList: function getOrderList(e) {
        var that = this;
        var postData = {
            token: wx.getStorageSync('__appUserInfo').token
        };
        postData.status = e;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        _server2.default.get(_urls2.default.links[0].orderlist, postData).then(function (res) {
            if (res.code == 0) {
                wx.hideLoading();
                that.setData({
                    orderList: res.data.orderList,
                    logisticsMap: res.data.logisticsMap,
                    goodsMap: res.data.goodsMap
                });
            }
        });
    },
    handleChangeBtn: function handleChangeBtn(e) {
        var btnIndex = e.id;
        this.data.current = btnIndex;
        this.setData({
            current: this.data.current
        });
        this.getOrderList(btnIndex);
    },
    handleContentChange: function handleContentChange(e) {
        var current = e.detail.current;
        this.setData({
            current: current
        });
        this.getOrderList(e.detail.current);
    },
    handleChange: function handleChange(e) {
        var btnIndex = e.target.dataset.index;
        var index = e.detail.index;
        this.data.current = index;
        this.setData({
            current: this.data.current
        });
        this.getOrderList(index);
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});