#! /usr/bin/perl -w

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use MongoDB;
use Data::Dumper;
use JSON;

my $q = CGI->new;

print "Content-type: text/html\n\n";

my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $games = $db->get_collection('games');


my $status = $q->param('status') || 'open';

my $records =  $games->find({ status => $status,  }, { limit => 4, });

my @reply = ();
while (my $game = $records->next) {
	push @reply, { frame => $game->{frame}, gameid => $game->{_id}->{value}, };
}

	
#print Dumper(\@reply);

my $json = JSON->new;
print $json->encode(\@reply);

=cut
$VAR1 = {
          'filmid' => '4f986090e21d9fcfb3407d81',
          'timestamp' => 1335874326,
          'status' => 'open',
          '_id' => bless( {
                            'value' => '4f9fd316b2c3f2e903000001'
                          }, 'MongoDB::OID' ),
          'frame' => '/var/data/guessfilm/4f986090e21d9fcfb3407d81/GZv_glGzgTayq21720jceA.jpg'
        };
=cut
