#! /usr/bin/perl

use strict;


opendir MINED, '/home/nyddle/parsevk/parsed_films' or die "$!";
while (my $file = readdir(MINED)) {

	print "$file\n";	
	open FILE, "/home/nyddle/parsevk/parsed_films/$file" or die "$!";
	open LINKS, "> $file";
	while (my $line = <FILE>) {
		#print "$line\n";
		#<a class="wk_photo_no_padding" href="/photo-4569_118063336"
		while ($line =~ /wk_photo_no_padding" href="(.*?)"/g) {
			print LINKS "$1\n";	
		}
	}
	close FILE;
	close LINKS;
}
close MINED;
