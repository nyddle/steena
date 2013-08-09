#! /usr/bin/perl -w

use strict;
use Redis;
use JSON;
use Data::Dumper;

my $r = new Redis;
$r->select(1);
my $res = $r->zrevrange('scores', 0, -1, 'WITHSCORES');

my @arr = @$res;
my @new_arr = ();
    while ($#arr > 0) {
        my ($uid, $score) = (shift @arr, shift @arr);
        push @new_arr, [$uid, $score];
    }

my $json = JSON->new;
print "Content-type: text/html\n\n";
print $json->encode(\@new_arr);

