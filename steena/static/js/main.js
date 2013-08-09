
$(document).ready(function(){$("input[name=do_submit]").click(submit);});function login(){var data={username:$("input[name=username]").val(),password:$("input[name=password]").val(),};var register=$("input[name=reg]").attr("register")=='register';$('#reg').attr('register','false');$.ajax({type:register?"POST":"GET",url:register?"/api/create_account":"/api/login",data:data,success:function(r){if(r.status=="ok"){document.cookie='auth='+r.auth+'; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';window.location.href="/";}else{$("#errormsg").html(r.err)}}});return false;}
function reset_password(){var data={username:$("input[name=username]").val(),email:$("input[name=email]").val(),};$.ajax({type:"GET",url:"/api/reset-password",data:data,success:function(r){if(r.status=="ok"){window.location.href="/reset-password-ok";}else{$("#errormsg").html(r.error)}}});return false;}
function submit(){var data={news_id:$("input[name=news_id]").val(),text:'',url:$("input[name=url]").val(),title:$("textarea[name=text]").val(),};if($('#postfb').length){if(($('#postfb').val()=='share')&&$('#postfb').attr('checked')){data['postfb']='postfb';}else{}}else{}
var del;$.ajax({type:"POST",url:del?"/api/delnews":"/api/submit",data:data,success:function(r){if(r.status=="ok"){if(r.news_id==-1){window.location.href="/";}else{window.location.href="/news/"+r.news_id;}}else{$("#errormsg").html(r.err);}}});return false;}
function update_profile(){var data={email:$("input[name=email]").val(),password:$("input[name=password]").val(),about:$("textarea[name=about]").val(),};$.ajax({type:"POST",url:"/api/updateprofile",data:data,success:function(r){if(r.status=="ok"){window.location.reload();}else{$("#errormsg").html(r.error)}}});return false;}
function post_comment(){var data={news_id:$("#insertcommentform input[name=news_id]").val(),comment_id:$("#insertcommentform input[name=comment_id]").val(),parent_id:$("#insertcommentform input[name=parent_id]").val(),comment:$("#insertcommentform textarea[name=comment]").val(),};$.ajax({type:"POST",url:"/api/postcomment",data:data,success:function(r){if(r.status=="ok"){if(r.op=="insert"){window.location.href="/news/"+r.news_id+"?r="+Math.random()+"#"+
r.news_id+"-"+r.comment_id;}else if(r.op=="update"){window.location.href="/editcomment/"+r.news_id+"/"+
r.comment_id;}else if(r.op=="delete"){window.location.href="/news/"+r.news_id;}}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});return false;}
function animate_news(){function setKeyboardNavigation(){$(function(){$(document).keyup(function(e){var active=$('article.active');if(e.which==74||e.which==75){var newActive;if(active.length==0){if(e.which==74){newActive=$('article').first();}else{newActive=$('article').last();}}else if(e.which==74){newActive=$($('article').get($('article').index(active)+1));}else if(e.which==75){var index=$('article').index(active);if(index==0)return;newActive=$($('article').get(index-1));}
if(newActive.length==0)return;active.removeClass('active');newActive.addClass('active');if($(window).scrollTop()>newActive.offset().top)
$('html, body').animate({scrollTop:newActive.offset().top-10},100);if($(window).scrollTop()+$(window).height()<newActive.offset().top)
$('html, body').animate({scrollTop:newActive.offset().top-$(window).height()+newActive.height()+10},100);}
if(e.which==13&&active.length>0){location.href=active.find('h2 a').attr('href');}
if(e.which==65&&active.length>0){active.find('.uparrow').click();}
if(e.which==90&&active.length>0){active.find('.downarrow').click();}});$('#newslist article').each(function(i,news){$(news).click(function(){var active=$('article.active');active.removeClass('active');$(news).addClass('active');});});});}
$('.iic').click(function(){$('#insertcommentform').insertAfter($(this).parent());var parent_id=$('#insertcommentform').prev().parent().find('input[name="comment_id"]').val();$('#insertcommentform').find('input[name="parent_id"]').val(parent_id);});$('#comments article.comment').each(function(i,comment){var comment_id=$(comment).data("commentId");comment=$(comment);up=comment.find(".uparrow");down=comment.find(".downarrow");var voted=up.hasClass("voted")||down.hasClass("voted");if(!voted){up.click(function(e){e.preventDefault();var data={comment_id:comment_id,vote_type:"up",};$.ajax({type:"POST",url:"/api/votecomment",data:data,success:function(r){if(r.status=="ok"){$('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("voted")
$('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("disabled")}else{alert(r.error);}}});});down.click(function(e){e.preventDefault();var data={comment_id:comment_id,vote_type:"down",};$.ajax({type:"POST",url:"/api/votecomment",data:data,success:function(r){if(r.status=="ok"){$('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("disabled")
$('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("voted")}else{alert(r.error);}}});});}});try{$('#leftcaption').html($("a[href='"+$(location).attr('pathname')+"']").attr('title').toUpperCase());}catch(err){}
$("a[href='"+$(location).attr('pathname')+"']").css("text-decoration","none");$("a[href='"+$(location).attr('pathname')+"']").css("color","gray");$('#reglink').click(function(){$('#reg').attr('register','register');$('#f').submit();});(function(){function numpf(n,f,s,t){var n10=n%10;if((n10==1)&&((n==1)||(n>20))){return f;}else if((n10>1)&&(n10<5)&&((n>20)||(n<10))){return s;}else{return t;}}
jQuery.timeago.settings.strings={prefixAgo:null,prefixFromNow:"через",suffixAgo:"назад",suffixFromNow:null,seconds:"меньше минуты",minute:"минуту",minutes:function(value){return numpf(value,"%d минута","%d минуты","%d минут");},hour:"час",hours:function(value){return numpf(value,"%d час","%d часа","%d часов");},day:"день",days:function(value){return numpf(value,"%d день","%d дня","%d дней");},month:"месяц",months:function(value){return numpf(value,"%d месяц","%d месяца","%d месяцев");},year:"год",years:function(value){return numpf(value,"%d год","%d года","%d лет");}};})();prepareDynamicDates();$("abbr.timeago").timeago();}
function logged_in(){au=$('.a-user').html();return au;}
function toggle_login(){$('.right-col-fixed').toggle(400);$('.right-col-fixed').toggleClass('active')
return false;}
function humane_log(message){humane.log(message,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}
function load_bq(){$('blockquote').each(function(){description=$(this).text();description=description.replace(/\s/g,"");if(description!='None'){pr=$(this).parent().find('a.preview');pr.show();}else{$(this).text('Превью недоступно.');}});$('.preview').click(function(){$(this).parent().parent().parent().parent().find('blockquote').toggle();return false;});}
$(document).ready(function(){$('.show-more-compact').click(function(){var preview_state=$('.show-more-compact span').text()=='Убрать'?'none':'block';var data={'preview':preview_state};$.ajax({type:"POST",url:"/api/settings",data:data,success:function(r){if(r.status=="ok"){}else{}}});$(this).toggleClass('active')
if($('.show-more-compact span').text()=='Убрать'){$('blockquote').hide();$('.top-news-list').infinitescroll('retrieve');$('.top-news-list').infinitescroll('retrieve');}else{$('blockquote').show();}
$('.show-more-compact span').text($('.show-more-compact span').text()=='Убрать'?'Показать':'Убрать');return false;});load_bq();rel=$(document);animate_right_news();animate_news(rel);$(function(){var $container=$('.top-news-list');$container.imagesLoaded(function(){$container.masonry({itemSelector:'li',columnWidth:100});});$container.infinitescroll({navSelector:'#page-nav',nextSelector:'#page-nav:last a',itemSelector:'li',debug:true,prefill:true,behavior:'local',path:function(index){var type=$(location).attr('pathname');if(type=='/'){type='/new/';}
index-=1;return type+index+"/";},loading:{finishedMsg:'Все.',img:'http://i.imgur.com/6RMhx.gif'}},function(newElements){var $newElems=$(newElements).css({opacity:0});$newElems.imagesLoaded(function(){$newElems.animate({opacity:1});$container.masonry('appended',$newElems,true);animate_news(newElements);load_bq();});});});});$(document).ready(function(){toggle_login();$('#enter').click(function(){toggle_login();});$('#add').click(function(){toggle_login();});var menuText=" ";$(function(){$("body").addClass("js");$(".menu_main").prepend("<a href='#' class='link_nav'>"+menuText+"</a>");$(".menu_main li:has(ul)").addClass("menu_parent");$(".link_nav").click(function(){$(".menu_main > ul").toggleClass("menu_expanded");$(this).toggleClass("menu_parent_exp");return false;})
$(".menu_parent").click(function(){$(this).find(">ul").toggleClass("menu_expanded");$(this).toggleClass("menu_parent_exp");return false;})})});function animate_object(){}
function animate_news(rel){$(rel).find('.iic').click(function(){$('#insertcommentform').insertAfter($(this).parent());var parent_id=$('#insertcommentform').prev().parent().find('input[name="comment_id"]').val();$('#insertcommentform').find('input[name="parent_id"]').val(parent_id);});$(rel).find('article').each(function(i,news){var news_id=$(news).data("newsId");news=$(news);up=news.find(".uparrow");down=news.find(".downarrow");save=news.find('.topic-like');del=news.find('.delnews');var voted=up.hasClass("voted")||down.hasClass("voted");del.click(function(e){confirm('Удалить новость??');e.preventDefault();var data={news_id:news_id,};$.ajax({type:"POST",url:"/api/delnews",data:data,success:function(r){if(r.status=="ok"){alert('News deleted!');news.remove();}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});})
up.click(function(e){up=$(this);var voted=up.hasClass("voted")||down.hasClass("voted");if(!logged_in()){humane.log("Войдите, чтобы голосовать!",{timeout:1000,clickToClose:true,addnCls:'humane-error'});}
e.preventDefault();var data={news_id:news_id,vote_type:"up",apisecret:apisecret};if(voted){data['delete']=1;$.ajax({type:"POST",url:"/api/votenews",data:data,success:function(r){if(r.status=="ok"){n=$("article[data-news-id="+news_id+"]");n.find(".uparrow").removeClass("voted");n.find(".downarrow").addClass("disabled");if(up.html()!=null){up_count=up.find('.upvote-count').html();if(up_count>0){up_count--;}
up.find('.upvote-count').html(up_count);}}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});}else{$.ajax({type:"POST",url:"/api/votenews",data:data,success:function(r){if(r.status=="ok"){n=$("article[data-news-id="+news_id+"]");n.find(".uparrow").addClass("voted");n.find(".downarrow").addClass("disabled");if(up.html()!=null){up_count=up.find('.upvote-count').html();up_count++;up.find('.upvote-count').html(up_count);}}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});}
down.click(function(e){if(typeof(apisecret)=='undefined')return;e.preventDefault();var data={news_id:news_id,vote_type:"down",apisecret:apisecret};$.ajax({type:"POST",url:"/api/votenews",data:data,success:function(r){if(r.status=="ok"){n=$("article[data-news-id="+news_id+"]");n.find(".uparrow").addClass("disabled");n.find(".downarrow").addClass("voted");}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});});});save.click(function(e){save=$(this);if(!logged_in()){humane.log("Войдите, чтобы сохранить новость.",{timeout:1000,clickToClose:true,addnCls:'humane-error'});}
e.preventDefault();news_id=$(this).data('news-id');var data={news_id:news_id,};if($(this).hasClass('voted')){data['delete']=1;$.ajax({type:"POST",url:"/api/savenews",data:data,success:function(r){if(r.status=="ok"){humane.log('Новость удалена.');save.removeClass('voted');}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});}else{$.ajax({type:"POST",url:"/api/savenews",data:data,success:function(r){if(r.status=="ok"){humane.log('Новость сохранена.');save.addClass('voted');}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});}});});$(rel).find('#comments article.comment').each(function(i,comment){var comment_id=$(comment).data("commentId");comment=$(comment);up=comment.find(".uparrow");down=comment.find(".downarrow");var voted=up.hasClass("voted")||down.hasClass("voted");if(!voted){up.click(function(e){if(typeof(apisecret)=='undefined')return;e.preventDefault();var data={comment_id:comment_id,vote_type:"up",apisecret:apisecret};$.ajax({type:"POST",url:"/api/votecomment",data:data,success:function(r){if(r.status=="ok"){$('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("voted")
$('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("disabled")}else{alert(r.error);}}});});down.click(function(e){if(typeof(apisecret)=='undefined')return;e.preventDefault();var data={comment_id:comment_id,vote_type:"down",apisecret:apisecret};$.ajax({type:"POST",url:"/api/votecomment",data:data,success:function(r){if(r.status=="ok"){$('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("disabled")
$('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("voted")}else{alert(r.error);}}});});}});try{$('#leftcaption').html($("a[href='"+$(location).attr('pathname')+"']").attr('title').toUpperCase());if(($(location).attr('pathname')=='/')||($(location).attr('pathname')=='/new/')){$('#rightcaption').html('ПОПУЛЯРНЫЕ');}}catch(err){}
$("a[href='"+$(location).attr('pathname')+"']").css("text-decoration","none");$("a[href='"+$(location).attr('pathname')+"']").css("color","gray");(function(){function numpf(n,f,s,t){var n10=n%10;if((n10==1)&&((n==1)||(n>20))){return f;}else if((n10>1)&&(n10<5)&&((n>20)||(n<10))){return s;}else{return t;}}
jQuery.timeago.settings.strings={prefixAgo:null,prefixFromNow:"через",suffixAgo:"назад",suffixFromNow:null,seconds:"меньше минуты",minute:"минуту",minutes:function(value){return numpf(value,"%d минута","%d минуты","%d минут");},hour:"час",hours:function(value){return numpf(value,"%d час","%d часа","%d часов");},day:"день",days:function(value){return numpf(value,"%d день","%d дня","%d дней");},month:"месяц",months:function(value){return numpf(value,"%d месяц","%d месяца","%d месяцев");},year:"год",years:function(value){return numpf(value,"%d год","%d года","%d лет");}};})();prepareDynamicDates();$("abbr.timeago").timeago();}
function animate_right_news(){$('.topic-top').click(function(){var news_id=$(this).attr('data-news-id');if(typeof(apisecret)=='undefined')return;var data={news_id:news_id,vote_type:"up",apisecret:apisecret};$.ajax({type:"POST",url:"/api/votenews",data:data,success:function(r){if(r.status=="ok"){n=$("article[data-news-id="+news_id+"]");n.find(".uparrow").addClass("voted");n.find(".downarrow").addClass("disabled");}else{alert(r.error);}}});});}
$(document).ready(function(){$('#f').isHappy({fields:{'#username':{required:true,message:'Какое-то имя у вас должно быть.'},'#password':{required:true,message:'Вы забыли пароль ввести.',},},submitButton:'#vhodButton',});$('#addform').isHappy({fields:{'#url':{required:true,message:'Добавьте ссылку.'},'#text':{required:true,message:'Заголовок забыли!',}}});});$(document).ready(function(){news_id=$('article').data('news-id');$('.commnets-list-icons').each(function(i,comment){comment=$(comment);comment.find('.topic-rating').click(function(){comment_id=comment.find('input').val();var data={comment_id:news_id+'-'+comment_id,vote_type:"up",};up=$(this);$.ajax({type:"POST",url:"/api/votecomment",data:data,success:function(r){if(r.status=="ok"){if(up.html()!=null){up_count=up.find('.comment-upvote-count').html();up_count++;up.find('.comment-upvote-count').html(up_count);}
n=$("article[data-news-id="+news_id+"]");n.find(".uparrow").addClass("voted");n.find(".downarrow").addClass("disabled");}else{humane.log(r.error,{timeout:1000,clickToClose:true,addnCls:'humane-error'});}}});});});});