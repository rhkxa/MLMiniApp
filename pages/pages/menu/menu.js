"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _urls = require("../../modules/urls.js");

var _urls2 = _interopRequireDefault(_urls);

var _server = require("../../modules/server.js");

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        nav_height: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        top: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        height: wx.DEFAULT_CONTENT_HEIGHT,
        current: 0,
        tabStyle: {
            'color': '#27323f'
        },
        activeTabStyle: {
            'color': '#ffd305',
            'border-right': '2rpx solid #ffd305'
        },
        customStyle: {
            'background-color': 'rgba(255, 255, 255, 0.98)'
        },
        searchHistory: [],
        swiperCurrent: 0,
        searcHover: '',
        activeCategoryName: "\u6240\u6709\u5546\u54C1\u5206\u7C7B"
    },
    onLoad: function onLoad() {
        var that = this;
        wx.showLoading({ title: "\u52A0\u8F7D\u4E2D..." });
        _server2.default.get(_urls2.default.links[0].banner, { type: "goods" }).then(function (res) {
            if (res.code == 0) {
                that.setData({ menu: res.data });
            }
        });
        _server2.default.get(_urls2.default.links[0].config, { key: "searchTag" }).then(function (res) {
            if (res.code == 0) {
                var kb = res.data.value;
                var ar = kb.split(',');
                that.setData({ searchTag: ar });
            }
        });
        _server2.default.get(_urls2.default.links[0].categoryall, {}).then(function (res) {
            if (res.code == 0) {
                var categories = [{ id: 0, name: "\u6240\u6709\u5206\u7C7B" }];
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].level == 1) {
                        categories.push(res.data[i]);
                    }
                }
                wx.hideLoading();
                that.setData({ categories: categories });
                that.getGoodsList(0);
            }
        });
        _server2.default.get(_urls2.default.links[0].glist, {}).then(function (res) {
            if (res.code == 0) {
                that.setData({ gnumber: res.data.length });
            }
        });
        that.searchData();
    },
    onShow: function onShow() {
        var that = this;
        that.searchData();
    },
    getGoodsList: function getGoodsList(categoryId) {
        if (categoryId == 0) {
            categoryId = '';
        }
        var that = this;
        _server2.default.get(_urls2.default.links[0].categoryall, {}).then(function (res) {
            if (res.code == 0) {
                var categorieslist = [];
                for (var i = 0; i < res.data.length; i++) {
                    if (categoryId != '') {
                        if (res.data[i].pid == categoryId) {
                            categorieslist.push(res.data[i]);
                        }
                    } else {
                        if (res.data[i].pid != 0) {
                            categorieslist.push(res.data[i]);
                        }
                    }
                }
                that.setData({ categorieslist: categorieslist });
            }
        });
    },
    searcHover: function searcHover(e) {
        var show = e.currentTarget.dataset.show;
        if (show == true) {
            this.setData({ showMask: show, searcHover: 'search-header-hover' });
        } else {
            this.setData({ showMask: show, searcHover: '' });
        }
    },
    getSearch: function getSearch(e) {
        var name = e.currentTarget.dataset.name;
        wx.navigateTo({
            url: "/pages/pages/menu/search/search?name=" + name
        });
        this.setData({ showMask: false, searcHover: '' });
    },
    search: function search(e) {
        var searchHistory = this.data.searchHistory;
        searchHistory.push({ name: e.detail.value });
        wx.setStorageSync('searchHistory', searchHistory);
        wx.navigateTo({
            url: "/pages/pages/menu/search/search?name=" + e.detail.value
        });
        this.setData({ showMask: false, searcHover: '' });
    },
    delSearch: function delSearch() {
        wx.setStorage({ key: "searchHistory", data: [] });
        this.setData({ searchHistory: [], searchHover: '' });
    },
    searchData: function searchData() {
        var that = this;
        wx.getStorage({
            key: 'searchHistory',
            success: function success(res) {
                that.setData({ searchHistory: res.data });
                if (res.data.length >= 0) {
                    that.setData({ searchHover: res.data.length });
                }
            }
        });
    },
    swiperChange: function swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    tabClick: function tabClick(e) {
        this.setData({ activeCategoryId: e.currentTarget.dataset.id });
        if (e.currentTarget.dataset.id == 0) {
            this.setData({ activeCategoryName: "\u6240\u6709\u5546\u54C1\u5206\u7C7B" });
        } else {
            this.setData({ activeCategoryName: e.currentTarget.dataset.name + "\u5206\u7C7B" });
        }
        this.getGoodsList(this.data.activeCategoryId);
    },
    levelClick: function levelClick(e) {
        wx.navigateTo({
            url: "/pages/pages/menu/list/list?id=" + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name
        });
    }

});