#! /usr/bin/perl -w

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use Guess;
use MongoDB;
use Data::Dumper;

my $q = CGI->new;

print "Content-type: text/html\n\n";


print '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Guess a film by name</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">

    <link rel="stylesheet" href="http://twitter.github.com/bootstrap/assets/css/bootstrap.css">
    <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.0.2/bootstrap.min.js">
    <link href="file-uploader/client/fileuploader.css" rel="stylesheet" type="text/css">

    <style>
      body {
        padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
      }
    </style>

<!-- We will use version hosted by Google-->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js" type="text/javascript"></script>
<!-- Required for jQuery dialog demo-->
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/ui-darkness/jquery-ui.css" type="text/css" media="all" />
<!-- AJAX Upload script doesn\'t have any dependencies-->
<script type="text/javascript" src="ajaxupload.3.6.js"></script>


    <!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
      <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
      <script src="file-uploader/client/fileuploader.js" type="text/javascript"></script>
     <!-- <script src="http://vk.com/js/api/xd_connection.js?2" type="text/javascript"></script> --!>
      <script src="http://vkontakte.ru/js/api/openapi.js" type="text/javascript"></script> 
<script type="text/javascript">
  VK.init({apiId:  2892731, onlyWidgets: true});
</script> 

<script src="http://bxslider.com/sites/default/files/jquery.bxSlider.min.js" type="text/javascript"></script>

  </head>

  <body>
    <div class="container">';

print '
    <div id="userrating"></div>
    <div id="rating"></div>
    <div id="game"><div id="frame" align="left"></div></div>

    <div id="cnt">
        <ul class="pills">
          <li class="display active" data-type="open"><a href="#">Open</a></li>
          <li class="display" data-type="closed"><a href="#">Close</a></li>
          <li class="display" data-type="byme"><a href="#">Solved by me</a></li>
        </ul>
    </div>
';


print '<script src="game.js"></script>';

print '

<!-- Put this div tag to the place, where the Comments block will be -->
<div id="vk_comments"></div>
<script type="text/javascript">
</script>';

print_footer();

