var redis = require('redis'),
client = redis.createClient();
var controller = function(){};

controller.prototype = {
	default: function (req, res, next) {
		res.render(req.path.substr(1,req.path.length-1),{});
	},
	home: function (req, res, next) {
		res.render('home',{
			title:'home page2',
			headerTitle: 'Welcome to Ecomerce',
		})
	},
	dumpQueue: function(req,res)
	{
		var redis = require("redis"),
		client = redis.createClient();
		client.lrange(req.params.name,0,100,function(e,obj){
			var out = _.reduce(obj,function(list,item){
				list.push(JSON.parse(item));
				return list;
			},[])
			//console.log(obj);
			res.json(out);
			client.quit();
		})
	},
	pushQueue: function(req,res)
	{
		var redis = require("redis"),
		client = redis.createClient();

		client.lpush(req.params.name, JSON.stringify(req.body),function(e,obj){
			if(e){
				res.json(e);
				return;
			}
			res.json(obj);
			client.quit();
		});
		return;
	},
	name: function (req, res, next) {
		res.render('name',{
			title:'home page2',
			headerTitle: 'Welcome to Ecomerce',
			vowels: ['ey','y','a','o','u','ine','ia','ai'],
			consonants: ['b','p','m','f','d','t','n','l','g','k','h','ch','sh','z','ts','s','tr','j'],
			nameBases:[
				{eng: 'chy', chi: '琪', index: 1},
				{eng: 'ly', chi: '莉', index: 1},
				{eng: 'na', chi: '娜', index: 1},
				{eng: 'ai', chi: '艾', index: 2},
				{eng: 'bey', chi: '蓓', index: 2},
				{eng: 'da', chi: '妲', index: 2},
				{eng: 'dy', chi: '蒂', index: 2},
				{eng: 'fey', chi: '菲', index: 2},
				{eng: 'jey', chi: '婕', index: 2},
				{eng: 'jia', chi: '佳', index: 2},
				{eng: 'ley', chi: '蕾', index: 2},
				{eng: 'mey', chi: '梅', index: 2},
				{eng: 'my', chi: '蜜', index: 2},
				{eng: 'ny', chi: '妮', index: 2},
				{eng: 'shy', chi: '熙', index: 2},
				{eng: 'bee', chi: '碧', index: 3},
				{eng: 'bine', chi: '白', index: 3},
				{eng: 'dine', chi: '黛', index: 3},
				{eng: 'fa', chi: '法', index: 4},
				{eng: 'hine', chi: '海', index: 4},
				{eng: 'i', chi: '儀', index: 2},
				{eng: 'la', chi: '菈', index: 3},
				{eng: 'line', chi: '萊', index: 3},
				{eng: 'lu', chi: '璐', index: 3},
				{eng: 'o', chi: '偶', index: 3},
				{eng: 'pu', chi: '璞', index: 3},
				{eng: 'sha', chi: '霞', index: 3},
				{eng: 'ty', chi: '堤', index: 3},
				{eng: 'yia', chi: '亞', index: 3},
				{eng: 'cho', chi: '秋', index: 4},
				{eng: 'chu', chi: '珠', index: 4},
				{eng: 'du', chi: '杜', index: 5},
				{eng: 'gine', chi: '改', index: 6},
				{eng: 'gu', chi: '古', index: 3},
				{eng: 'hu', chi: '瑚', index: 3},
				{eng: 'jy', chi: '姬', index: 3},
				{eng: 'kine', chi: '開', index: 5},
				{eng: 'mo', chi: '謀', index: 5},
				{eng: 'mao', chi: '懋', index: 5},
				{eng: 'mu', chi: '慕', index: 2},
				{eng: 'pine', chi: '徘', index: 5},
				{eng: 'py', chi: '闢', index: 6},
				{eng: 'sa', chi: '撒', index: 5},
				{eng: 'sho', chi: '琇', index: 4},
				{eng: 'su', chi: '蘇', index: 5},
				{eng: 'ta', chi: '㳫', index: 5},
				{eng: 'tine', chi: '邰', index: 5},
				{eng: 'tru', chi: '初', index: 4},
				{eng: 'tsine', chi: '采', index: 3},
				{eng: 'u', chi: '舞', index: 4},
				{eng: 'zine', chi: '哉', index: 6},
				{eng: 'zu', chi: '祖', index: 6},
				{eng: 'a', chi: '阿', index: 6},
				{eng: 'bu', chi: '步', index: 6},
				{eng: 'do', chi: '荳', index: 4},
				{eng: 'jo', chi: '鷲', index: 6},
				{eng: 'lo', chi: '樓', index: 6},
				{eng: 'mine', chi: '買', index: 7},
				{eng: 'nu', chi: '努', index: 7},
				{eng: 'pey', chi: '珮', index: 3},
				{eng: 'to', chi: '透', index: 6},
				{eng: 'trine', chi: '柴', index: 6},

				{eng: 'jong', chi: '講', index: 7},
				{eng: 'tong', chi: '棠', index: 2},
				{eng: 'shong', chi: '湘', index: 2},

				{eng: 'jing', chi: '靖', index: 1},
				{eng: 'ting', chi: '婷', index: 2},
				{eng: 'bing', chi: '冰', index: 3},
				{eng: 'ping', chi: '蘋', index: 3},
				{eng: 'ming', chi: '敏', index: 2},
				{eng: 'ding', chi: '丁', index: 4},
				{eng: 'ning', chi: '凝', index: 2},
				{eng: 'ling', chi: '伶', index: 2},
				{eng: 'ching', chi: '晴', index: 1},
				{eng: 'shing', chi: '心', index: 1},
				{eng: 'trine', chi: '柴', index: 6},
				{eng: 'tu', chi: '兔', index: 5}
			]
		});
	},
	get: function (req, res, next) {
		req.models.post.find({id: req.params.id}, function(err, data) {
			if(err) return next(err);
			res.send(data[0]);
		});
	},
	getall: function (req, res, next) {
		req.models.post.find(function(err, data) {
			if(err) return next(err);
			res.send(data);
		});
	},
	create: function (req, res, next) {
		req.models.post.create({
			title: 'title',
			content: 'content'
		}, function(err, result) {
			if(err) return next(err);
			res.send(result);
		});
	}
};

module.exports = new controller;
