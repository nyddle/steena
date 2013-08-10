function load_user_wall(vkid) {


}

$(document).ready(function() {
  VK.Api.call('friends.get', {fields: ['uid', 'first_name', 'last_name'], order: 'name'}, function(r){
   if(r.response){
    r = r.response;
    var ol = $('#friends');
    ol.html('');
    ol.append('<ul>');
    for(var i = 0; i < r.length; ++i){
       var li = '<li>' + r[i].first_name+' '+r[i].last_name+' ('+r[i].uid+')' + '</li>';
       var li = '<li data-vkid="' + r[i].uid + '">' + r[i].first_name+' '+ r[i].last_name + '</li>';
       ol.append(li);
       // alert(r[i].first_name);
    }
    ol.append('</ul>');
    $('li').click(function() {
        alert($(this).data('vkid'));
    });

   }else alert("Не удалось получить список ваших друзей");
  });

    
});
