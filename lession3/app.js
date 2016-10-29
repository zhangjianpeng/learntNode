var express = require('express')
var superagent=require('superagent')
var cheerio=require('cheerio')
var app=express()
app.get('/',function(req,res,next){
	superagent.get('https://cnodejs.org')
		.end(function(err,sres){
			if(err){
				return next(err);
			}
			var $=cheerio.load(sres.text);
			var items=[];
			$('#topic_list .cell').each(function(idx,element){
				var $element=$(element);
				var $topic_title=$element.find('.topic_title');
				var img=$element.find('.user_avatar > img')
				items.push({
					title:$topic_title.attr('title'),
					href:$topic_title.attr('href'),
					author:img.attr('title')
				});
			});
			res.send(items);
	});

});

app.listen(3000,function(req,res){
	console.log('app running at port 3000')
})
