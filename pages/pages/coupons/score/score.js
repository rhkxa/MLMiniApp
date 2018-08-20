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
        score_sign_continuous: 0,
        score: 0,
        ci: 0
    },
    onShow: function onShow() {
        this.checkScoreSign();
    },
    onLoad: function onLoad() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].useramount, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ amount: res.data });
            }
        });
        _server2.default.get(_urls2.default.links[0].signrules, {}).then(function (res) {
            if (res.code == 0) {
                that.setData({ rules: res.data });
            }
        });
    },
    checkScoreSign: function checkScoreSign() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].signtoday, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ ci: 1 });
            }
            _server2.default.get(_urls2.default.links[0].scorelogs, { token: token }).then(function (res) {
                if (res.code == 0) {
                    that.setData({ score_sign_continuous: res.data.result[0].continuous });
                }
            });
        });
    },
    scoresign: function scoresign() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].scoresign, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.onLoad();
                that.checkScoreSign();
                wx.showToast({ title: "\u7B7E\u5230\u6210\u529F", icon: 'none' });
            }
        });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});