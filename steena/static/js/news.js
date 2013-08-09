
function animate_news() {
    function setKeyboardNavigation() {
        $(function() {
            $(document).keyup(function(e) {
                var active = $('article.active');
                if (e.which == 74 || e.which == 75) {
                    var newActive;
                    if (active.length == 0) {
                        if (e.which == 74) {
                            newActive = $('article').first();
                        } else {
                            newActive = $('article').last();
                        }
                    } else if (e.which == 74){
                        newActive = $($('article').get($('article').index(active)+1));
                    } else if (e.which == 75){
                        var index = $('article').index(active);
                        if (index == 0) return;
                        newActive = $($('article').get(index-1));
                    }
                    if (newActive.length == 0) return;
                    active.removeClass('active');
                    newActive.addClass('active');
                    if ($(window).scrollTop() > newActive.offset().top)
                        $('html, body').animate({ scrollTop: newActive.offset().top - 10 }, 100);
                    if ($(window).scrollTop() + $(window).height() < newActive.offset().top)
                        $('html, body').animate({ scrollTop: newActive.offset().top - $(window).height() + newActive.height() + 10 }, 100);
                }
                if (e.which == 13 && active.length > 0) {
                    location.href = active.find('h2 a').attr('href');
                }
                if (e.which == 65 && active.length > 0) {
                    active.find('.uparrow').click();
                }
                if (e.which == 90 && active.length > 0) {
                    active.find('.downarrow').click();
                }
            });
            $('#newslist article').each(function(i,news) {
                $(news).click(function() {
                    var active = $('article.active');
                    active.removeClass('active');
                    $(news).addClass('active');
                });
            });
        });
    }

    // Install the onclick event in all news arrows the user did not voted already.
        $('.iic').click(function() {
           $('#insertcommentform').insertAfter($(this).parent());
            var parent_id = $('#insertcommentform').prev().parent().find('input[name="comment_id"]').val();
            $('#insertcommentform').find('input[name="parent_id"]').val( parent_id );
            //alert($("#insertcommentform input[name=comment_id]").val());
     
        });


    // Install the onclick event in all comments arrows the user did not
    // voted already.
        $('#comments article.comment').each(function(i,comment) {
            var comment_id = $(comment).data("commentId");
            comment = $(comment);
            up = comment.find(".uparrow");
            down = comment.find(".downarrow");
            var voted = up.hasClass("voted") || down.hasClass("voted");
            if (!voted) {
                up.click(function(e) {
                    e.preventDefault();
                    var data = {
                        comment_id: comment_id,
                        vote_type: "up",
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
                    e.preventDefault();
                    var data = {
                        comment_id: comment_id,
                        vote_type: "down",
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
                $('#leftcaption').html($("a[href='"+$(location).attr('pathname')+"']").attr('title').toUpperCase());
            } catch (err) {}
            $("a[href='"+$(location).attr('pathname')+"']").css("text-decoration","none"); 
            $("a[href='"+$(location).attr('pathname')+"']").css("color","gray"); 

            $('#reglink').click(function() {
                    $('#reg').attr('register','register'); 
                    $('#f').submit();
            });

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

