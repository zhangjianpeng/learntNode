var express = require('express')
var superagent=require('superagent')
var cheerio=require('cheerio')
var eventproxy=require('eventproxy')

var url=require('url')
var superagentUrl='https://cnodejs.org';
var app=express();
var ep=new eventproxy()
app.get('/',function(req,res){
	var topicUrls=[]
	superagent.get(superagentUrl).end(function(err,sres){
		if(err){
			return console.error(err)
		}
		var $=cheerio.load(sres.text);
		$('#topic_list .topic_title').each(function(idx,element){
			var $element=$(element);
			var href=url.resolve(superagentUrl,$element.attr('href'));
			topicUrls.push(href);
		})
		
ep.after('topic_html',topicUrls.length,function(topics){
                topic=topics.map(function(topicPair){
                        var topicUrl=topicPair[0];
                        var topHtml=topicPair[1];
                        var $=cheerio.load(topHtml)
                        comment1=$('.reply_content').eq(0).text().trim()
                        return {href:topicUrl,comment1:comment1}
                });
                res.send(topic)
        })
        topicUrls.forEach(function (topicUrl){
        console.log('for each'+topicUrl)
                superagent.get(topicUrl).end(function(err,sres){
                        console.log('fetch '+topicUrl +' successful')
                        ep.emit('topic_html',[topicUrl,sres.text]);
                })
        })
	})

})
app.listen(3000,function(req,res){
	console.log('app running at the port 3000')
})
