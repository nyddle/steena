#!/usr/bin/perl-wT 
use strict; 
use CGI; 
use CGI::Carp qw (fatalsToBrowser); 
use File::Basename; 

$CGI::POST_MAX = 1024 * 500000; 
my $safe_filename_characters = "a-zA-Z0-9_.-"; 
my $upload_dir = "/var/data/guessfilm"; 
my $query = new CGI; 
my $filename = $query->param("photo"); 
if ( !$filename ) 
    { 
    print $query->header ( ); 
    print "There was a problem uploading your photo (try a smaller fil
+e)."; 
    exit; 
    }
my ( $name, $path, $extension ) = fileparse ( $filename, '\..*' ); 
$filename = $name . $extension; 
$filename =~ tr/ /_/;
$filename =~ s/[^$safe_filename_characters]//g;
if ( $filename =~ /^([$safe_filename_characters]+)$/ ) 
    { 
    $filename = $1; 
    } 
else 
    { 
    die "Filename contains invalid characters"; 
    } 
    
my $upload_filehandle = $query->upload("photo"); 
open ( UPLOADFILE, ">$upload_dir/$filename" ) or die "$!"; 
binmode UPLOADFILE; 
while ( <$upload_filehandle> ) 
    { 
    print UPLOADFILE; 
    } 
close UPLOADFILE; 
print $query->header ( );
print "Content-type: text/html\n\n";
print <<HTML;
<html> 
<head> 
<title>Thanks</title> 
</head> 
<body> 
<p>Thanks for uploading your file!</p> 
<p>Your file:</p> <p><href src="/upload/$filename" alt="File" /></p> 
</body> 
</html> 
HTML
