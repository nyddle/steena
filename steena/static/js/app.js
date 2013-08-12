var yourid;

$(document).ready(function() {

  $('#sender').attr('value', yourid);

  VK.Api.call('friends.get', {fields: ['uid', 'first_name', 'last_name'], order: 'name'}, function(r){
   if(r.response){
    r = r.response;
    var ol = $('#friends');
    ol.html('');
    ol.append('<ul>');
    for(var i = 0; i < r.length; ++i){
       var li = '<li data-vkid="' + r[i].uid + '"><a href="/' + r[i].uid + '">' + r[i].first_name+' '+ r[i].last_name + '</a></li>';
       ol.append(li);
       // alert(r[i].first_name);
    }
    ol.append('</ul>');
   } else alert("Не удалось получить список ваших друзей");
  });

  $('.like').click(function() {
      public_id = $(this).parent().parent().attr('id');
      like_type = $(this).attr('value');
      alert('Лайк засчитан.');
  })
    
});

