package Guess;

require Exporter;
@ISA = qw(Exporter);
@EXPORT = qw(log_event);



my $conn = MongoDB::Connection->new("host" => "ds031747.mongolab.com", "port" => 31747,) or die "$!";
my $auth = $conn->authenticate("guessfilm", "nyddle", "bubble9520") or die "$!";
my $db = $conn->guessfilm;
my $films = $db->get_collection('gamelog');


sub log_event() {



}

1;

