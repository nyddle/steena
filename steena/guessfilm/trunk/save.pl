#! /usr/bin/perl -w

use strict;
use CGI;
use Data::Dumper;
use Guess;
use MongoDB;
use CGI::Carp qw(fatalsToBrowser);

my $q = CGI->new();
print "Content-type: text/html\n\nMESSAGE SAVED!";


=cut
$VAR1 = {
          'country' => [
                         'England'
                       ],
          '_id' => bless( {
                            'value' => '4f81f9ce5b9d3ea418000003'
                          }, 'MongoDB::OID' ),
          'title' => 'Snatch',
          'title_ru' => [
                          "\x{411}\x{43e}\x{43b}\x{44c}\x{448}\x{43e}\x{439} \x{43a}\x{443}\x{448}",
                          "\x{421}\x{43f}\x{438}\x{437}\x{434}\x{438}\x{43b}\x{438}"
                        ],
          'year' => '2000',
          'dir' => 'snatch2000'
        };
=cut

my %upd = ();
foreach my $field ('title', 'year', 'director') {
	$upd{$field} = $q->param($field);
}

foreach my $field ('title_ru', 'country') {
	my @arr = split(';', $q->param($field));
	$upd{$field} = \@arr;
}

my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('films');
$upd{dir} = make_dir_id(\%upd);
$films->update({"title" => $q->param('title')}, {'$set' => \%upd},  {'upsert' => 1}) or die "$!";

print Dumper(\%upd);



#$coll->insert({name => "MongoDB", type => "database", count => 1, info => {x => 203, y => 102}});

