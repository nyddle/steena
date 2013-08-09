$(document).ready(function() {    
    $("input[name=do_submit]").click(submit);
});


function login() {
    var data = {
        username: $("input[name=username]").val(),
        password: $("input[name=password]").val(),
    };
   var register = $("input[name=reg]").attr("register") == 'register';
    $('#reg').attr('register','false');
    $.ajax({
        type: register ? "POST" : "GET",
        url: register ? "/api/create_account" : "/api/login",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                document.cookie =
                    'auth='+r.auth+
                    '; expires=Thu, 1 Aug 2030 20:00:00 UTC; path=/';
                window.location.href = "/";
            } else {
                $("#errormsg").html(r.err)
            }
        }
    });
    return false;
}

function reset_password() {
    var data = {
        username: $("input[name=username]").val(),
        email: $("input[name=email]").val(),
    };
    $.ajax({
        type: "GET",
        url: "/api/reset-password",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                window.location.href = "/reset-password-ok";
            } else {
                $("#errormsg").html(r.error)
            }
        }
    });
    return false;
}

function submit() {
    var data = {
        news_id: $("input[name=news_id]").val(),
        text: '', //$("input[name=title]").val(),
        url: $("input[name=url]").val(),
        title: $("textarea[name=text]").val(),
    };
    if ($('#postfb').length) {
        if (($('#postfb').val() == 'share' ) && $('#postfb').attr('checked')) {
            data['postfb'] = 'postfb';
        } else {
        }
    } else {
    }

    var del;//= $("input[name=del]").length && $("input[name=del]").attr("checked");
    $.ajax({
        type: "POST",
        url: del ? "/api/delnews" : "/api/submit",
        data: data,
        success: function(r) {
            //alert(JSON.stringify(r));
            if (r.status == "ok") {
                if (r.news_id == -1) {
                    window.location.href = "/";
                } else {
                    window.location.href = "/news/"+r.news_id;
                }
            } else {
                $("#errormsg").html(r.err);
            }
        }
    });
    return false;
}

function update_profile() {
    var data = {
        email: $("input[name=email]").val(),
        password: $("input[name=password]").val(),
        about: $("textarea[name=about]").val(),
    };
    $.ajax({
        type: "POST",
        url: "/api/updateprofile",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                window.location.reload();
            } else {
                $("#errormsg").html(r.error)
            }
        }
    });
    return false;
}

function post_comment() {
    
    var data = {
        news_id: $("#insertcommentform input[name=news_id]").val(),
        comment_id: $("#insertcommentform input[name=comment_id]").val(),
        parent_id: $("#insertcommentform input[name=parent_id]").val(),
        comment: $("#insertcommentform textarea[name=comment]").val(),
    };
    
    $.ajax({
        type: "POST",
        url: "/api/postcomment",
        data: data,
        success: function(r) {
            if (r.status == "ok") {
                if (r.op == "insert") {
                    window.location.href = "/news/"+r.news_id+"?r="+Math.random()+"#"+
                        r.news_id+"-"+r.comment_id;
                } else if (r.op == "update") {
                    window.location.href = "/editcomment/"+r.news_id+"/"+
                                           r.comment_id;
                } else if (r.op == "delete") {
                    window.location.href = "/news/"+r.news_id;
                }
            } else {
                humane.log(r.error, { timeout: 1000, clickToClose: true, addnCls: 'humane-error' });
            }
        }
    });
    return false;
}


