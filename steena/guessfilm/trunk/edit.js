$(document).ready(function() {

        function createUploader(){
            var uploader = new qq.FileUploader({
                element: document.getElementById('file-uploader-demo1'),
                action: 'http://50.116.35.24/cgi-bin/file-uploader/server/perl.cgi',
		params: {
		    filmhash: $('#_id').val(),
		}
            });
        };


        // in your app create uploader as soon as the DOM is ready
        // don't wait for the window to load
        createUploader();


	$("#save_changes").click(function(e) {
		$.ajax({
		 url: "http://50.116.35.24/cgi-bin/save.pl",
		 data: $('#film_form').serialize(),
		 success: function(msg) {
			alert(msg);
		 },
		});
	});


});

