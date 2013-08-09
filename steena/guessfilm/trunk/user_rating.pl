#! /usr/bin/perl -w

use strict;
use Redis;
use CGI;

my $q = CGI->new;
my $user_id = $q->param('user_id') || "1210352";

my $r = new Redis;
$r->select(1);
my $res = $r->zscore('scores',$user_id);
print "Content-type: text/html\n\n$res";

