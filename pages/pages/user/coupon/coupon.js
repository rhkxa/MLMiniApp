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
        current: 0,
        show_1: true,
        show_2: false,
        show_3: false,
        endtime: {},
        startime: {}
    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].mydiscounts, { token: token }).then(function (res) {
            if (res.code == 0) {
                for (var i = 0; i < res.data.length; i++) {
                    that.getStartimes(res.data[i].dateStart, res.data[i].id);
                    that.getEndtimes(res.data[i].dateEnd, res.data[i].id);
                }
                that.setData({ couponList: res.data });
            }
        });
    },
    getStartimes: function getStartimes(e, id) {
        var that = this;
        var start = e.replace(/-/g, '/'),
            times = Date.parse(new Date(start)) / 1000;
        var startime = that.data.startime;
        startime[id] = _utils2.default.formatTime(times, 'Y.M.D');
        that.setData({ startime: startime });
    },
    getEndtimes: function getEndtimes(e, id) {
        var that = this;
        var end = e.replace(/-/g, '/'),
            times = Date.parse(new Date(end)) / 1000;
        var endtime = that.data.endtime;
        endtime[id] = _utils2.default.formatTime(times, 'Y.M.D');
        that.setData({ endtime: endtime });
    },
    handleChange: function handleChange(e) {
        var that = this;
        var index = e.detail.index;
        if (index == 0) {
            that.setData({
                show_1: true,
                show_2: false,
                show_3: false
            });
        }
        if (index == 1) {
            that.setData({
                show_1: false,
                show_2: true,
                show_3: false
            });
        }
        if (index == 2) {
            that.setData({
                show_1: false,
                show_2: false,
                show_3: true
            });
        }
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});