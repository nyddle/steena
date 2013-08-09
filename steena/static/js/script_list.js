function logged_in() {
    au = $('.a-user').html();
    return au;
}


function toggle_login() {
    $('.right-col-fixed').toggle(400);
    $('.right-col-fixed').toggleClass('active')
    //$(this).toggleClass('active')
    return false;
}    

function humane_log(message) {
    humane.log(message, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); // Not logged in
}

function load_bq() {
    $('blockquote').each(function() {
        description = $(this).text(); 
        description = description.replace(/\s/g, "");
        if (description != 'None') {
            pr = $(this).parent().find('a.preview');
            pr.show();
        } else {
            $(this).text('Превью недоступно.');
        }
    });

    $('.preview').click(function() {
        $(this).parent().parent().parent().parent().find('blockquote').toggle();
        return false;
    });
}

$(document).ready(function(){

   $('.show-more-compact').click(function() {

        var preview_state = $('.show-more-compact span').text() == 'Убрать' ? 'none' : 'block';
        var data = { 'preview' : preview_state };
        $.ajax({
            type: "POST",
            url: "/api/settings",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                    //alert('Settings changed.')
                } else {
                    //alert(r.error);
                }
            }
        });

        $(this).toggleClass('active')
        if ($('.show-more-compact span').text() == 'Убрать') {
            $('blockquote').hide();
            $('.top-news-list').infinitescroll('retrieve');
            $('.top-news-list').infinitescroll('retrieve');
        } else {
            $('blockquote').show();
        }
        $('.show-more-compact span').text($('.show-more-compact span').text() == 'Убрать' ? 'Показать' : 'Убрать');
        return false;
    });

  load_bq();  

  rel = $(document);
  animate_right_news();
  animate_news(rel);  

  $(function(){

    var $container = $('.top-news-list');

    $container.imagesLoaded(function(){
      $container.masonry({
        itemSelector: 'li',
        columnWidth: 100
      });
    });
    $container.infinitescroll({
      navSelector  : '#page-nav',    // selector for the paged navigation
      nextSelector : '#page-nav:last a',  // selector for the NEXT link (to page 2)
      itemSelector : 'li',     // selector for all items you'll retrieve
      debug: true,
      prefill: true,
      //path: ["/nextposts/2/", "/nextposts/3/"],
      behavior: 'local',
      path: function(index) {
                        var type = $(location).attr('pathname');
                        if (type == '/') {
                            type = '/new/';
                        }
                        index -= 1;
                        return type+index+"/";
                                },

      loading: {
          finishedMsg: 'Все.',
          img: 'http://i.imgur.com/6RMhx.gif'
        }
      },
      // trigger Masonry as a callback
      function( newElements ) {
        // hide new items while they are loading
        var $newElems = $( newElements ).css({ opacity: 0 });
        // ensure that images load before adding to masonry layout
        $newElems.imagesLoaded(function(){
          // show elems now they're ready
          $newElems.animate({ opacity: 1 });
          $container.masonry( 'appended', $newElems, true );
          animate_news(newElements);  
          load_bq();
        });
      }
    );
  });

});


$(document).ready(function(){
    toggle_login();    
    //$('.add-form').toggleClass('disabled-form');

    $('#enter').click(function() {
        toggle_login();    
    });

     $('#add').click(function() {
        //alert($('#logged').val()) 
        //alert('Hello!');
        toggle_login();    
    });

	var menuText = " ";
		$( function(){
			$("body").addClass("js");
			$(".menu_main").prepend("<a href='#' class='link_nav'>"+ menuText +"</a>");
			$(".menu_main li:has(ul)").addClass("menu_parent");
			$(".link_nav").click(
				function(){
					$(".menu_main > ul").toggleClass("menu_expanded");
					$(this).toggleClass("menu_parent_exp");
					return false;
				}
			)
		$(".menu_parent").click(
			function(){
				$(this).find(">ul").toggleClass("menu_expanded");
				$(this).toggleClass("menu_parent_exp");
				return false;
			}
		)
		})
	});


function animate_object() {


}


function animate_news(rel) {
    // Install the onclick event in all news arrows the user did not voted already.
        $(rel).find('.iic').click(function() {
           $('#insertcommentform').insertAfter($(this).parent());
            var parent_id = $('#insertcommentform').prev().parent().find('input[name="comment_id"]').val();
            $('#insertcommentform').find('input[name="parent_id"]').val( parent_id );
            //alert($("#insertcommentform input[name=comment_id]").val());
     
        });


        $(rel).find('article').each(function(i,news) {
            var news_id = $(news).data("newsId");
            news = $(news);
            up = news.find(".uparrow");
            down = news.find(".downarrow");
            save = news.find('.topic-like');
            del = news.find('.delnews');
            var voted = up.hasClass("voted") || down.hasClass("voted");

            del.click(function(e) {
                confirm('Удалить новость??');
                e.preventDefault();
                var data = {
                    news_id: news_id,
                };
                $.ajax({
                    type: "POST",
                    url: "/api/delnews",
                    data: data,
                    success: function(r) {
                        if (r.status == "ok") {
                            alert('News deleted!');
                            news.remove();
                             } else {
                            humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' });
                        }
                    }
                });
        })    

                // INCREMENT !!
                /*
                <a title="" class="topic-rating uparrow" href="#"><span class="ic"></span>
                                    <span>1</span>
                </a>
                */
                up.click(function(e) {
                    up = $(this);
                    var voted = up.hasClass("voted") || down.hasClass("voted");
                    if (!logged_in()) {
                        humane.log("Войдите, чтобы голосовать!", { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); // Not logged in
                    }
                    e.preventDefault();
                    var data = {
                        news_id: news_id,
                        vote_type: "up",
                        apisecret: apisecret
                    };

                    if (voted) {
                        data['delete'] = 1;
                        $.ajax({
                            type: "POST",
                            url: "/api/votenews",
                            data: data,
                            success: function(r) {
                                if (r.status == "ok") {
                                    n = $("article[data-news-id="+news_id+"]");
                                    n.find(".uparrow").removeClass("voted");
                                    n.find(".downarrow").addClass("disabled");
                                    if (up.html() != null) {
                                        up_count = up.find('.upvote-count').html();
                                        if (up_count > 0) {
                                            up_count--;
                                        }
                                        up.find('.upvote-count').html(up_count);
                                    }
                                } else {
                                    humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); 
                                }
                            }
                        });
                    } else {
                        $.ajax({
                            type: "POST",
                            url: "/api/votenews",
                            data: data,
                            success: function(r) {
                                if (r.status == "ok") {
                                    n = $("article[data-news-id="+news_id+"]");
                                    n.find(".uparrow").addClass("voted");
                                    n.find(".downarrow").addClass("disabled");
                                    if (up.html() != null) {
                                        up_count = up.find('.upvote-count').html();
                                        up_count++;
                                        up.find('.upvote-count').html(up_count);
                                    }
                                } else {
                                    humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); 
                                }
                            }
                        });
 
                    }

                down.click(function(e) {
                    if (typeof(apisecret) == 'undefined') return; // Not logged in
                    e.preventDefault();
                    var data = {
                        news_id : news_id,
                        vote_type: "down",
                        apisecret: apisecret
                    };
                    $.ajax({
                        type: "POST",
                        url: "/api/votenews",
                        data: data,
                        success: function(r) {
                            if (r.status == "ok") {
                                n = $("article[data-news-id="+news_id+"]");
                                n.find(".uparrow").addClass("disabled");
                                n.find(".downarrow").addClass("voted");
                            } else {
                                humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); 
                            }
                        }
                    });
                });
            });
            
            save.click(function(e) {
                    save = $(this);
                    if (!logged_in()) {
                        humane.log("Войдите, чтобы сохранить новость.", { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); // Not logged in
                    }
                    e.preventDefault();
                    news_id = $(this).data('news-id');
                    var data = {
                        news_id : news_id,
                    };

                    if ($(this).hasClass('voted')) {
                        data['delete'] = 1;
                        $.ajax({
                            type: "POST",
                            url: "/api/savenews",
                            data: data,
                            success: function(r) {
                                 if (r.status == "ok") {
                                    humane.log('Новость удалена.');
                                    save.removeClass('voted');
                                } else {
                                    humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); 
                                }
                            }
                        });
 
                    } else {  
                        $.ajax({
                            type: "POST",
                            url: "/api/savenews",
                            data: data,
                            success: function(r) {
                                 if (r.status == "ok") {
                                    humane.log('Новость сохранена.');
                                    save.addClass('voted');
                                } else {
                                    humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' }); 
                                }
                            }
                        });
                    }
                });
        });

    // Install the onclick event in all comments arrows the user did not
    // voted already.
        $(rel).find('#comments article.comment').each(function(i,comment) {
            var comment_id = $(comment).data("commentId");
            comment = $(comment);
            up = comment.find(".uparrow");
            down = comment.find(".downarrow");
            var voted = up.hasClass("voted") || down.hasClass("voted");
            if (!voted) {
                up.click(function(e) {
                    if (typeof(apisecret) == 'undefined') return; // Not logged in
                    e.preventDefault();
                    var data = {
                        comment_id: comment_id,
                        vote_type: "up",
                        apisecret: apisecret
                    };
                    $.ajax({
                        type: "POST",
                        url: "/api/votecomment",
                        data: data,
                        success: function(r) {
                            if (r.status == "ok") {
                                $('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("voted")
                                $('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("disabled")
                            } else {
                                alert(r.error);
                            }
                        }
                    });
                });
                down.click(function(e) {
                    if (typeof(apisecret) == 'undefined') return; // Not logged in
                    e.preventDefault();
                    var data = {
                        comment_id: comment_id,
                        vote_type: "down",
                        apisecret: apisecret
                    };
                    $.ajax({
                        type: "POST",
                        url: "/api/votecomment",
                        data: data,
                        success: function(r) {
                            if (r.status == "ok") {
                                $('article[data-comment-id="'+r.comment_id+'"]').find(".uparrow").addClass("disabled")
                                $('article[data-comment-id="'+r.comment_id+'"]').find(".downarrow").addClass("voted")
                            } else {
                                alert(r.error);
                            }
                        }
                    });
                });
            }
        });


            try {
                //alert($("a[href='"+$(location).attr('pathname')+"']"));
                $('#leftcaption').html($("a[href='"+$(location).attr('pathname')+"']").attr('title').toUpperCase());
                if (($(location).attr('pathname') == '/') || ($(location).attr('pathname') == '/new/')) {
                    $('#rightcaption').html('ПОПУЛЯРНЫЕ');
                }
            } catch (err) {}
            $("a[href='"+$(location).attr('pathname')+"']").css("text-decoration","none"); 
            $("a[href='"+$(location).attr('pathname')+"']").css("color","gray"); 

            
            // Russian
            (function() {
              function numpf(n, f, s, t) {
                // f - 1, 21, 31, ...
                // s - 2-4, 22-24, 32-34 ...
                // t - 5-20, 25-30, ...
                var n10 = n % 10;
                if ( (n10 == 1) && ( (n == 1) || (n > 20) ) ) {
                  return f;
                } else if ( (n10 > 1) && (n10 < 5) && ( (n > 20) || (n < 10) ) ) {
                  return s;
                } else {
                  return t;
                }
              }

              jQuery.timeago.settings.strings = {
                prefixAgo: null,
                prefixFromNow: "через",
                suffixAgo: "назад",
                suffixFromNow: null,
                seconds: "меньше минуты",
                minute: "минуту",
                minutes: function(value) { return numpf(value, "%d минута", "%d минуты", "%d минут"); },
                hour: "час",
                hours: function(value) { return numpf(value, "%d час", "%d часа", "%d часов"); },
                day: "день",
                days: function(value) { return numpf(value, "%d день", "%d дня", "%d дней"); },
                month: "месяц",
                months: function(value) { return numpf(value, "%d месяц", "%d месяца", "%d месяцев"); },
                year: "год",
                years: function(value) { return numpf(value, "%d год", "%d года", "%d лет"); }
              };
            })();
            prepareDynamicDates();
            $("abbr.timeago").timeago();

  
}        

function animate_right_news() {
    $('.topic-top').click(function() {
        var news_id = $(this).attr('data-news-id');
        //alert(news_id);
        if (typeof(apisecret) == 'undefined') return; // Not logged in
        var data = {
            news_id : news_id,
            vote_type: "up",
            apisecret: apisecret
        };
        $.ajax({
          type: "POST",
            url: "/api/votenews",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                    n = $("article[data-news-id="+news_id+"]");
                    n.find(".uparrow").addClass("voted");
                    n.find(".downarrow").addClass("disabled");
                } else {
                    alert(r.error);
                }
            }
        });
    });
}


