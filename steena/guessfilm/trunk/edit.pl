#! /usr/bin/perl -w

use strict;
use CGI;
use CGI::Carp qw(fatalsToBrowser);
use Guess;
use MongoDB;
use Data::Dumper;

my $q = CGI->new;

print "Content-type: text/html\n\n";
print_header();
print '<script src="edit.js"></script>';

my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('films');

my $id = $q->param('id');

my $records =  $films->find({ dir => $id,  }, { limit => 1, });
my $film = $records->next;
        #print Dumper($film)."\n";
	my $id = make_dir_id($film);
	#print "<ul><a href=\"http://50.116.35.24/cgi-bin/edit.pl?id=$id\">$film->{title}</a> (".join(',', @{$film->{title_ru}}).")</ul>";
	#print Dumper($film);


	print '
	<h2>'.(defined $film->{title} ? 'Edit film' : 'New film').'</h2>
	       <div id="file-uploader-demo1">
			<noscript>
				<p>Please enable JavaScript to use file uploader.</p>
				<!-- or put a simple form for upload here -->
			</noscript>
		</div>

    <div class="span8">
      <form class="form-horizontal" id="film_form">
        <fieldset>
	<input type="hidden" id="_id" value="'.$film->{_id}.'">
          <legend>"'.$film->{title}.'"</legend>
          <div class="control-group">
            <label class="control-label" for="input01">Title</label>
            <div class="controls">
              <input type="text" class="input-xlarge" name="title" id="title" value="'.$film->{title}.'">
            </div>
          </div>
          <div class="control-group">
            <label class="control-label" for="input01">Russian title(s)</label>
            <div class="controls">

              <input type="text" class="input-xlarge" name="title_ru" id="title_ru" value="'.(defined $film->{title_ru} ? join(',',@{$film->{title_ru}}) : '').'">
            </div>
          </div>
          <div class="control-group">
            <label class="control-label" for="input01">Director</label>
            <div class="controls">

              <input type="text" class="input-xlarge" name="director" id="director" value="'.$film->{director}.'">
            </div>
          </div>
          <div class="control-group">
            <label class="control-label" for="input01">Country</label>
            <div class="controls">

              <input type="text" class="input-xlarge" name="country" id="country" value="'.(defined $film->{country} ? join(',',@{$film->{country}}) : '').'">
            </div>
          </div>

          <div class="control-group">
            <label class="control-label" for="input01">Year</label>
            <div class="controls">

              <input type="text" class="input-xlarge" name="year" id="year" value="'.$film->{year}.'">
            </div>
          </div>

         <div class="control-group">
            <label class="control-label" for="fileInput">Add frame</label>
            <div class="controls">
	</div>
          </div>
          <div class="control-group">
            <label class="control-label" for="textarea">Description</label>

            <div class="controls">
              <textarea class="input-xlarge" id="textarea" rows="3"></textarea>
            </div>
          </div>
        </fieldset>
      </form>
          <div class="form-actions">
            <button class="btn btn-primary" id="save_changes">Save changes</button>
            <button class="btn">Cancel</button>
          </div>
<div class="span8">
        <div id="uploaded_photos"></div>
</div>
';

my $fid = $film->{_id};

#print "/var/data/guessfilm/$fid";
if (-d "/var/data/guessfilm/$fid") {
    opendir DIR, "/var/data/guessfilm/$fid" or die "$!";
    print '<ul>';
    while (my $file = readdir(DIR)) {
        ($file !~ /\.(jpg|png)/) && next;
        print "<li><img src=\"../images/guessfilm/$fid/$file\" title=\"green peace\" /></li>\n";
    }
    closedir DIR;
    print '</ul>';
} else {
    print '<h2>no frames uploaded</h2>';
}

print_footer();


