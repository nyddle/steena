#! /usr/bin/perl -w

use strict;

#http://vk.com/pages?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85._%C2%AB%D0%94%D0%B0%D0%B2%D0%B0%D0%B9_%D0%B7%D0%B0%D0%B9%D0%BC%D0%B5%D0%BC%D1%81%D1%8F_%D0%BB%D1%8E%D0%B1%D0%BE%D0%B2%D1%8C%D1%8E%C2%BB


opendir DICT, 'dict' or die "$!";
while (my $file = readdir(DICT)) {
	$file =~ /^\./ && next;
	print "$file\n";
	open FILMLINK, "dict/$file";
	while (my $line = <FILMLINK>) {
		if ($line =~ /(pages\?oid=-4569&p=%D0%91%D0%B0%D0%B7%D0%B0_%D0%B4%D0%B0%D0%BD%D0%BD%D1%8B%D1%85\._.*?>)/) {
			#print "$1\n$line";
			my $link = $1;
			$link =~ s/">$//;
			print "/$link\n";
		}
	}
	close FILMLINK;
}
closedir DICT;
