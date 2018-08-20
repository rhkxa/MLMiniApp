'use strict';

var _config = require('../../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var subDomain = _config2.default.suburl;
var links = [{
	'tencentmap': 'https://apis.map.qq.com/ws/location/v1/ip', //腾讯地图
	'ordercreate': _config2.default.payurl, //创建订单
	'banner': subDomain + '&part=banner_list', //Banner列表
	'config': subDomain + '&part=get_config', //系统参数
	'gdetail': subDomain + '&part=goods_detail', //商品详情
	'glist': subDomain + '&part=goods_list', //商品列表
	'gprice': subDomain + '&part=goods_price', //商品价格
	'gvideo': subDomain + '&part=video_detail', //商品视频
	'favadd': subDomain + '&part=fav_add', //添加收藏
	'favdelete': subDomain + '&part=fav_del', //删除收藏
	'favlist': subDomain + '&part=fav_list', //收藏列表
	'checktoken': subDomain + '&part=checktoken', //检查Token
	'wxapplogin': subDomain + '&part=login', //登录接口
	'wxregister': subDomain + '&part=register', //注册接口
	'categoryall': subDomain + '&part=category_all', //商品分类列表
	'greputation': subDomain + '&part=goods_reputation', //商品评论
	'addsdefault': subDomain + '&part=address_default', //用户默认地址
	'addsdetail': subDomain + '&part=address_detail', //用户地址详细信息
	'addslist': subDomain + '&part=address_list', //用户地址列表 
	'addsadd': subDomain + '&part=address_add', //增加用户地址 
	'addupdate': subDomain + '&part=address_update', //更新用户地址 
	'adddelete': subDomain + '&part=address_delete', //删除用户地址 
	'mydiscounts': subDomain + '&part=discounts_my', //用户优惠券
	'ckdiscounts': subDomain + '&part=discounts_coupons', //查询可领取的优惠券
	'fediscounts': subDomain + '&part=discounts_fetch', //领取优惠券
	'orderstatis': subDomain + '&part=order_statistics', //订单状态
	'scorerule': subDomain + '&part=send_rule', //积分赠送规则
	'scorelogs': subDomain + '&part=score_logs', //积分明细记录 
	'scoresign': subDomain + '&part=score_sign', //签到 
	'signrules': subDomain + '&part=sign_rules', //签到赠送积分规则 
	'signtoday': subDomain + '&part=today_signed', //查询是否签到 
	'useramount': subDomain + '&part=user_amount', //用户钱包信息
	'orderlist': subDomain + '&part=order_list' //订单列表 

	//公告列表 subDomain+'&part=notice_list'
	//最新的一条公告数据 subDomain+'&part=notice_lastone'
	//通过id获取公告数据 subDomain+'&part=notice_detail'
	//订单关闭 subDomain+'&part=order_close'
	//检索可领取优惠券 subDomain+'&part=discounts_coupons'
	//领取优惠券 subDomain+'&part=discounts_fetch'
	//今日是否签到 subDomain+'&part=today_signed'
	//查询签到记录 subDomain+'&part=sign_logs'
	//积分明细记录 subDomain+'&part=score_logs'
	//商城订单详情接口 subDomain+'&part=order_detail'
	//确认收货接口 subDomain+'&part=order_delivery'
	//商品评价接口 subDomain+'&part=order_reputation'
	//获取商品评价数据 subDomain+'&part=goods_reputation'
	//商城会员购买创建订单 subDomain+'&part=order_hybuy'

}];

module.exports = {
	links: links,
	mapkey: _config2.default.mapkey
};