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
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px'

    },
    onShow: function onShow() {
        var that = this;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].addslist, { token: token }).then(function (res) {
            if (res.code == 0) {
                that.setData({ addressList: res.data });
            } else {
                that.setData({ addressList: '' });
            }
        });
    },
    selectTap: function selectTap(e) {
        var id = e.currentTarget.dataset.id;
        var token = wx.getStorageSync('__appUserInfo').token;
        _server2.default.get(_urls2.default.links[0].addupdate, { token: token, id: id, isDefault: 'true' }).then(function (res) {
            if (res.code == 0) {
                wx.navigateBack();
            }
        });
    },
    editAddess: function editAddess(e) {
        wx.navigateTo({
            url: "/pages/pages/user/address/add/add?id=" + e.currentTarget.dataset.id
        });
    },
    addAddess: function addAddess() {
        wx.navigateTo({ url: "/pages/pages/user/address/add/add" });
    },
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});