#! /usr/bin/perl -w

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use Guess;
use MongoDB;
use Data::Dumper;

print "Content-type: text/html\n\n";
print_header();
print '<script src="edit.js"></script>';

my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('films');

my $records =  $films->find;
while (my $film = $records->next) {
        #print Dumper($film)."\n";
	my $id = make_dir_id($film);
	print "<ul><a href=\"http://50.116.35.24/cgi-bin/edit.pl?id=$id\">$film->{title}</a> (".join(',', @{$film->{title_ru}}).")</ul>";
}

	print "<ul><a href=\"http://50.116.35.24/cgi-bin/edit.pl?id=newfilm\">ADD NEW</a> (Добавить новый фильм)</ul>";




print_footer();


