#! /usr/bin/perl -w

use strict;



open ALPHABET, 'wk';
my $line = <ALPHABET>;
close ALPHABET;

#print $line;
while ($line =~ /a class="wk_vk_link" href="(.*?)"/g) {
    print "$1\n";
}


#<table cellpadding="0" cellspacing="0" class="wk_table"><caption><b>Алфавитный указатель  (тысячи фильмов)</b></caption><tr><td><center><a class="wk_vk_link" href="/page-4569_6127500">А</a> | <a class="wk_vk_link" href="/page-4569_6127501">Б</a> | <a class="wk_vk_link" href="/page-4569_6134251">В</a> | <a class="wk_vk_link" href="/page-4569_6127504">Г</a> | <a class="wk_vk_link" href="/page-4569_6127506">Д</a> | <a class="wk_vk_link" href="/page-4569_6127507">Е</a> | <a class="wk_vk_link" href="/page-4569_6127508">Ж</a> | <a class="wk_vk_link" href="/page-4569_6127510">З</a> | <a class="wk_vk_link" href="/page-4569_6127512">И</a> | <a class="wk_vk_link" href="/page-4569_6127513">К</a> | <a class="wk_vk_link" href="/page-4569_6127514">Л</a> | <a class="wk_vk_link" href="/page-4569_6127516">М</a> | <a class="wk_vk_link" href="/page-4569_6127517">Н</a> | <a class="wk_vk_link" href="/page-4569_6127519">О</a> | <a class="wk_vk_link" href="/page-4569_6127523">П</a> | <a class="wk_vk_link" href="/page-4569_6127525">Р</a> | <a class="wk_vk_link" href="/page-4569_6127527">С</a> | <a class="wk_vk_link" href="/page-4569_6127528">Т</a> | <a class="wk_vk_link" href="/page-4569_6127530">У</a> | <a class="wk_vk_link" href="/page-4569_6134337">Ф</a> | <a class="wk_vk_link" href="/page-4569_6134338">Х</a> | <a class="wk_vk_link" href="/page-4569_6134339">Ц</a> | <a class="wk_vk_link" href="/page-4569_6134341">Ч</a> | <a class="wk_vk_link" href="/page-4569_6134343">Ш</a> | <a class="wk_vk_link" href="/page-4569_6134345">Щ</a> | <a class="wk_vk_link" href="/page-4569_6134346">Э</a> | <a class="wk_vk_link" href="/page-4569_6134348">Ю</a> | <a class="wk_vk_link" href="/page-4569_6134352">Я</a> | <a class="wk_vk_link" href="/page-4569_6134356">1...</a> | <a class="wk_vk_link" href="/page-4569_6209383">A-Z</a></center> </td></tr></table> <br/><br/>

