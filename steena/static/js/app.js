var yourid;


function draw_friend() {

    return '<a href="" class="friend"> \
        <div class="friend__avatar"> \
            <img src="images/avatar.jpg" alt="" width="30" /> \
        </div> \
        <div class="friend__name"> \
            Дмитрий Медведев\
        </div>\
    </a>';

}


$(document).ready(function() {

  alert(draw_friend());

  $('#sender').attr('value', yourid);

  VK.Api.call('friends.get', {fields: ['uid', 'first_name', 'last_name'], order: 'name'}, function(r){
   if(r.response){
    r = r.response;

    var ol = $('#friends');
    var rids = []
    ol.html('');
    ol.append('<ul>');

    for(var i = 0; i < r.length; ++i){
       //var li = '<li data-vkid="' + r[i].uid + '"><a href="/' + r[i].uid + '">' + r[i].first_name+' '+ r[i].last_name + '</a></li>';
       //ol.append(li);
       //rids.push(r[i].uid);
       // alert(r[i].first_name);
       $('#friends').append(draw_friend());
    }
    ol.append('</ul>');
   data = { friends : rids, me : yourid };
   $.ajax({
            type: "POST",
            url: "/api/friends",
            data: data,
            success: function(r) {
                if (r.status == "ok") {
                    //alert('sdv');
                 } else {
                    alert('not ok');
                }
            }
        });


   } else alert("Не удалось получить список ваших друзей");
  });

/* friend

<a href="" class="friend">
    <div class="friend__avatar">
        <img src="images/avatar.jpg" alt="" width="30" />
    </div>
    <div class="friend__name">
        Дмитрий Медведев
    </div>
</a>

/friend */ 


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

