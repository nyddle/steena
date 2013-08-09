$(document).ready(function() {

    var cgameid = 'defaultgame';
    var cfilmid;
	  VK.init({
	    apiId: 2892731,
	    onlyWidgets: true
	  });


    var parts=document.location.search.substr(1).split("&");
    var flashVars={}, curr;
    for (i=0; i<parts.length; i++) {
        curr = parts[i].split("=");
        flashVars[curr[0]] = curr[1];
    }
    var viewer_id = flashVars['viewer_id'];
    var user_id = viewer_id;//flashVars['user_id'];



    function load_game(game_id, image_addr, film_id) {
			cgameid = game_id;
			cfilmid = film_id;
				image_addr = image_addr.replace(/avatar-/, 'resized-');
				$('#game').html('<img src="'+ image_addr +'">');
			$('#vk_comments').html('');
            try {
                VK.Observer.unsubscribe('widgets.comments.new_comment');
            } catch (err) {
            }
			VK.Widgets.Comments("vk_comments", {limit: 10, width: "496", attach: 0, autoPublish:0, onChange: checkAnswer}, cgameid);
			VK.Observer.unsubscribe('widgets.comments.delete_comment');
    }


    function load_rating() {
            $.ajax({
             url: "http://50.116.35.24/cgi-bin/get_rating.pl",
             data: 'user_id=' + user_id,
             success: function(msg) {
                $('#rating').html(msg);
                var rating = $.parseJSON(msg);
                for (var position in rating) {
                    var datum = rating[position];
                    alert(datum[0]);
                    VK.api("users.get", {uids: 'nyddle', fields: 'first_name,last_name'}, function(data) {alert(data.response[0].first_name); console.debug(data.response);}, function(err){alert(err.response);} );
                }
             },
            });
    }

    function load_user_rating() {
            $.ajax({
             url: "http://50.116.35.24/cgi-bin/user_rating.pl",
             data: 'user_id=' + user_id,
             success: function(msg) {
                $('#userrating').html('Your rating: ' + msg);
             },
            });


    }

    function get_games() {   
			var arr;
			for (x in arr = ['open', 'close']) {
				var type = arr[x];
				//alert(arr[x]);
				$.ajax({
				 url: "http://50.116.35.24/cgi-bin/get_games.pl",
				 data: 'status=' + type,
				 success: function(msg) {
					var open = $.parseJSON(msg);
					var opendiv = '';
					for (x in open) {
						game = open[x]
						var frameaddr = game.frame.replace(/\/var\/data\//, '');
						frameaddr = frameaddr.replace(/(.+)\//, "$1\/avatar-");
						image_addr = '/images/' + frameaddr;
						var film_id = game.filmid;
						opendiv += '<img class="loadgame" data-filmid="' + film_id + '" data-imageaddr="' + image_addr + '" data-gameid="' + game.gameid + '" src="' + image_addr + '" alt="" />';
					}
					//alert(msg);
					$('#' + type).html(opendiv);

					$('.loadgame').bind('click', function(el) {
							load_game($(this).attr('data-gameid'), $(this).attr('data-imageaddr'), $(this).attr('data-filmid'));
					});
				 },
				});
			}
	}

	function checkAnswer(num, answer) {
                $.ajax({
                 url: "http://50.116.35.24/cgi-bin/check_answer.pl",
                 data: 'answer=' + answer + '&game_id=' + cgameid + '&film_id=' + cfilmid + '&user_id=' + user_id,
                 success: function(msg) {
                        if (msg.match(/right/)) {
                                alert('You\'re right!');
                        } else {
                                alert('You\'re wrong');
                        }
                 },
                });
	}

    load_rating();
    load_user_rating();

    var arr;
    for (x in arr = ['open', 'close']) {
            var type = arr[x];
            $.ajax({
             url: "http://50.116.35.24/cgi-bin/get_games.pl",
             data: 'status=' + type,
             success: function(msg) {
                    var open = $.parseJSON(msg);
                    var opendiv = '';
                    for (x in open) {
                            game = open[x]
                            var frameaddr = game.frame.replace(/\/var\/data\//, '');
                            frameaddr = frameaddr.replace(/(.+)\//, "$1\/avatar-");
                            image_addr = '/images/' + frameaddr;
                            var film_id = game.filmid;
                            opendiv += '<img class="loadgame" data-filmid="' + film_id + '" data-imageaddr="' + image_addr + '" data-gameid="' + game.gameid + '" src="' + image_addr + '" alt="" />';
                    }
                    $('#' + type).html(opendiv);
                    $('.loadgame').bind('click', function(el) {
                                    load_game($(this).attr('data-gameid'), $(this).attr('data-imageaddr'), $(this).attr('data-filmid'));
                    });
             },
            });
    }



});

