#! /usr/bin/perl -w

use strict;

push @INC, '/usr/lib/perl/5.10.1';
use CGI;
use Data::Dumper;
use Guess;
use Gamelog;
use MongoDB;
use MongoDB::OID;
use CGI::Carp qw(fatalsToBrowser);
use String::Approx qw(amatch);
use File::Copy;
#use Image::Magick;

my $q = CGI->new();

my $answer = $q->param('answer') || 'fight club';
my $game_id = $q->param('game_id');

if (!$game_id) { die "game id not specified!\n" };


if (! $answer) {
	die "answer not specified (";
}

my $original_answer = $answer;
$answer = lc $answer;

print "Content-type: text/html\n\n";



my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('films');


opendir GUESS, '/var/data/guessfilm/guess';
my @files = readdir GUESS;
@files = grep(/guess-/, @files);
my $photo = $files[0];
closedir GUESS;

my $id = $q->param('film_id');
if (!$id) { die "film id not specified!\n"; }

my $res = $films->find_one({ _id => MongoDB::OID->new(value => $id)});

my @titles = ( @{ $res->{title_ru} },  $res->{title}  );
map ($_ = lc($_), @titles);
my @matched = amatch($answer, @titles);

#print @titles;

if ($#matched > -1) {
    #`perl /var/www/new_game.pl`;
	print "You're right!!!! $titles[0]\n\n";
	log_event( { 'type' => 'try', res => '1', user => 'anonymous', 'time' => time(), film => $id, 'guess' => $original_answer  });

	# =============================
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
					@files = grep(!/(resize|avatar)/, @files);
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
					print "\n\ncp /var/data/guessfilm/$id/$photo /var/data/guessfilm/guess/guess-$id.$type\n\n";
					copy("/var/data/guessfilm/$id/$photo","/var/data/guessfilm/guess/guess-$id.$type") or die "Copy failed: $!";

					my $films = $db->get_collection('games');
					my %game = (
						timestamp => time(),
						frame => "/var/data/guessfilm/$id/$photo",
						status => "open",
						filmid => "$id",

					);
					$films->insert(\%game) or die "$!";
=cut
					my($image, $x);
					$image = Image::Magick->new;
					$x = $image->Read("/var/data/guessfilm/guess/guess-$id.$type");
					$x = $image->Resize(geometry => "450x300", width=>450, height=>300);
					  warn "$x" if "$x";
					#$x = $image->Write("/var/data/guessfilm/guess/guess-$id.$type");
					  warn "$x" if "$x";
=cut

					#print @files;
				} else {
					print "no /var/data/guessfilm/$id\n";
				}
			}
	}
	# ===============================================================
} else {
    print "Bad try =((";
    log_event( { 'type' => 'try', res => '0', user => 'anonymous', 'time' => time(), film => $id, 'guess' => $original_answer });
}


