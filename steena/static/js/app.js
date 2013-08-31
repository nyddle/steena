var yourid;


function draw_friend(uid, name, photo) {

    return '<a href="/' + uid + '" class="friend"> \
        <div class="friend__avatar"> \
            <img src="' + photo + '" alt="" width="30" /> \
        </div> \
        <div class="friend__name"> \
            ' + name + '\
        </div>\
    </a>';

}


$(document).ready(function() {

  $('#sender').attr('value', yourid);

  VK.Api.call('friends.get', {fields: ['uid', 'first_name', 'last_name', 'photo'], order: 'name'}, function(r){
   if(r.response){
    r = r.response;

    var rids = [];
    for(var i = 0; i < r.length; ++i){
       var name = r[i].first_name+' '+ r[i].last_name;
       var uid = r[i].uid;
       var photo = r[i].photo;
       rids.push(uid)
       $('#friends').append(draw_friend(uid, name, photo));
    }
   data = { friends : rids, me : yourid };
   $.ajax({
            type: "POST",
            url: "/api/friends",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                 } else {
                    alert('not ok');
                }
            }
        });


   } else alert("Не удалось получить список ваших друзей");
  });


  $('.like').click(function() {
      public_id = $(this).parent().parent().attr('id');
      like_type = $(this).attr('value');

        var data = {
            public_id : public_id,
            like_type : like_type,
        };
        $.ajax({
            type: "POST",
            url: "/api/like",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                    alert('Лайк засчитан.');
                     } else {
                    alert('no luck (');
                }
            }
        });
  })
    
});

