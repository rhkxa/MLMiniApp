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
        focus: false
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].useramount, { token: token }).then(function (res) {
            console.log(res);
            if (res.code == 0) {
                that.setData({ amount: res.data });
            }
        });
    },
    bindSave: function bindSave(e) {
        var that = this;
        var amount = e.detail.value.amount;
        if (amount == "" || amount * 1 < 100) {
            wx.showConfirm({
                content: "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u63D0\u73B0\u91D1\u989D",
                showCancel: false,
                confirmColor: '#ffd305',
                confirmText: "\u91CD\u65B0\u8F93\u5165",
                success: function success(res) {}
            });
            return;
        }

        wx.showConfirm({
            content: "\u63D0\u73B0\u63A5\u53E3\u8FD8\u6CA1\u6709",
            showCancel: false,
            confirmColor: '#ffd305',
            confirmText: "\u91CD\u65B0\u8F93\u5165",
            success: function success(res) {}
        });
    },
    rechargeTap: function rechargeTap() {
        wx.showConfirm({
            content: "\u5145\u503C\u63A5\u53E3\u8FD8\u6CA1\u6709",
            showCancel: false,
            confirmColor: '#ffd305',
            confirmText: "\u91CD\u65B0\u8F93\u5165",
            success: function success(res) {}
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});