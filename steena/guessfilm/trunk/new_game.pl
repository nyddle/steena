#! /usr/bin/perl -w

use strict;
use MongoDB;
use Data::Dumper;

my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('films');

#my $records =  $films->find;
#  var res = guessfilm.films.findOne({random : {$gte: Math.random()}});


my $found = 0;
my $film;

while (! $found) {
		my $random_number = rand();
		print "$random_number\n";
		$film = $films->find(
				{
					random => {
						'$gte' => $random_number,
					},
				}
		);
		my $res = $film->next;
		if (defined $res->{title}) {
			print Dumper($res);
			my $id = $res->{_id};	
			if (-e "/var/data/guessfilm/$id") {
				$found = 1;
				print "Directory exists";
				opendir PICS, "/var/data/guessfilm/$id" or die "$!";
				my @files = readdir PICS;
				@files = grep /\.(jpg|png)$/, @files;
				my $length = $#files+1;
				my $rand_photo = int(rand($length));
				#print "Total $length files!\n";
				closedir PICS;
				#print "\nChosen: $rand_photo\n\n";
				my $photo = $files[$rand_photo];
				print "\n/var/data/guessfilm/$id/$photo\n\n\n";
				my $type = $1 if ($photo =~ /(jpg|jpeg|png)$/);
				`rm /var/data/guessfilm/guess/*`;
				`cp /var/data/guessfilm/$id/$photo /var/data/guessfilm/guess/guess-$id.$type`;
				print @files;
			} else {
				print "no /var/data/guessfilm/$id\n";
			}
		}
}

