<?php

include('source/clientlogin.php');
include('source/sql.php');
include('source/connectioninfo.php');

function format_address($street, $city, $state, $zip) {

	$result = str_replace(" ", "&nbsp;", $street);
	$result = $result . "<br />$city, $state $zip";
	return $result;
}

//phpinfo();

//get token
$token = ClientLogin::getAuthToken(ConnectionInfo::$google_username, ConnectionInfo::$google_password);
$ftclient = new FTClientLogin($token);

//select * from table
$result = $ftclient->query(SQLBuilder::select(ConnectionInfo::$fusionTableId));

?>

<!DOCTYPE html>
<html>
<head>
	<title>DMMapp - List</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta property="og:locale" content="en_US">
    <meta property="og:type" content="website">
    <meta property="og:title" content="DMMapp - Digitized Medieval Manuscripts List">
    <meta property="og:determiner" content="the">
    <meta property="og:description" content="The DMMapp is the portal to thousands of digitized medieval manuscripts around the world!">
    <meta property="og:url" content="http://digitizedmedievalmanuscripts.org/app/data/">
    <meta property="og:image" content="http://digitizedmedievalmanuscripts.org/app/images/dmmapp.jpg" />
    <meta property="og:site_name" content="DMMmaps - Digitized Medieval Manuscripts Maps" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@SexyCodicology">
    <meta name="twitter:title" content="The DMMapp">
    <meta name="twitter:description" content="The DMMapp is the portal to thousands of digitized medieval manuscripts around the world!">
    <meta name="twitter:creator" content="@SexyCodicology">
    <meta name="twitter:image:src" content="http://digitizedmedievalmanuscripts.org/app/images/dmmapp.jpg">
    <meta name="twitter:domain" content="http://Digitizedmedievalmanuscripts.org">
    <link href='http://fonts.googleapis.com/css?family=Philosopher:400,700' rel='stylesheet' type='text/css'>
    <link href='http://digitizedmedievalmanuscripts.org/app/data/styles/bootstrap.min.css' media='all' rel='stylesheet' type='text/css' />
	<link href='http://digitizedmedievalmanuscripts.org/app/data/styles/master.css' media='all' rel='stylesheet' type='text/css' />
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	<!--<script src="/source/analytics_lib.js" type="text/javascript"></script>-->
	<script src="http://digitizedmedievalmanuscripts.org/app/data/source/jquery.dataTables.min.js" type="text/javascript"></script>
	 <script type="text/javascript">
//<![CDATA[
  (function() {
    var shr = document.createElement('script');
    shr.setAttribute('data-cfasync', 'false');
    shr.src = '//dsms0mj1bbhn4.cloudfront.net/assets/pub/shareaholic_legacy.js';
    shr.type = 'text/javascript'; shr.async = 'true';
    shr.onload = shr.onreadystatechange = function() {
      var rs = this.readyState;
      if (rs && rs != 'complete' && rs != 'loaded') return;
      var site_id = '528c47708669d3f5e561e116ce55b93c';
      try { Shareaholic.init(site_id); } catch (e) {}
    };
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(shr, s);
  })();
//]]>
</script>
	<script type="text/javascript">
	    $(function(){
	      $(".data").dataTable({
	        "aaSorting": [[0, "asc"]],
	        "aoColumns": [
	          null,
	          null,
	          null,
	          null,
	          { "bSearchable": false, "bSortable": false }
	        ],
	        "bFilter": true,
	        "bInfo": true,
	        "bPaginate": true,
            "sPaginationType": "full_numbers"
	      });
	    });
  </script>
</head>
<body>
    <div class='navbar navbar-default navbar-static-top'>
        <div class='container'>
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class='navbar-brand' href='/'>
                    <h1>DMMapp</h1>
                </a>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="http://digitizedmedievalmanuscripts.org/app/">DMMapp</a>
                    </li>
                    <li>
                        <a href="http://digitizedmedievalmanuscripts.org/maps/">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="http://sexycodicology.net/blog/">
                            Sexy Codicology Blog
                        </a>
                    </li>

                    <li>
                        <a href="http://digitizedmedievalmanuscripts.org/">
                            DMMmaps Blog
                        </a>
                    </li>
                    <li>
                        <a href="http://digitizedmedievalmanuscripts.org/contact/send-us-tip/">
                            Missing a Library?
                        </a>
                    </li>
                    <li>
                        <a href="http://digitizedmedievalmanuscripts.org/contact/">
                            Feedback
                        </a>
                    </li>
                </ul>
            </div>
            <!--/.nav-collapse -->
        </div>
    </div>
        <div class="container">
        <div class="row">
            <h1>DMMapp Data</h1>
            <div class="col-md-8">

		<p class='tagline'>List of repositories hosting digitized medieval manuscripts, including links to the digital resources. <a href='/app/'>Find them on the map &raquo;</a></p>

		<p> The Digitized Medieval Manuscripts Maps' Dataset by Giulio Menna and Marjolein de Vos is licensed under a <a href="http://creativecommons.org/licenses/by-sa/4.0/" rel="license">Creative Commons Attribution-ShareAlike 4.0 International License</a>. <strong>You may use the data however you please, and we would love to see the results of your experiments.</strong> </p>

        <p>The Digitized Medieval Manuscripts Maps (DMMmaps) Data uses <a href="http://docs.google.com/%E2%80%8E">Google Docs</a> and links to thousands of medieval manuscripts available in Europe, United States, and the rest of the world.</p>

        <p><strong>It is, essentially, the most complete list of all the libraries that have digitized medieval manuscripts and made them available online for free.</strong></p>

        <p>This button links you to the original data, which is hosted on Google's servers. The data is updated in real-time: When we add a library, the online spreadsheet is automatically updated too.</p>
            </div>
        <div class="col-md-4"><iframe src="//www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2FSexyCodicology&amp;width&amp;height=62&amp;colorscheme=light&amp;show_faces=false&amp;header=false&amp;stream=false&amp;show_border=false&amp;appId=705263246163822" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:62px; width:200px" allowTransparency="true"></iframe>
                    <iframe allowtransparency="true" frameborder="0" scrolling="no" src="//platform.twitter.com/widgets/follow_button.html?screen_name=SexyCodicology" style="width:250px; height:40px;"></iframe></div>
        <div class='shareaholic-canvas' data-app='share_buttons' data-app-id='17580630'></div>

        <table class='data'>
			<thead>
				<tr>
					<th>Nation</th>
					<th>City</th>
					<th>Institution</th>
					<th>No. of digitized documents</th>
					<th>Link to digitized objects</th>
				</tr>
			</thead>
			<tbody>
<?php

foreach ($result as $i => $row) {
	if ($i > 0)
	{
		echo "
		<tr>
		<td>$row[0]</td>
		<td>$row[1]</td>
		<td>$row[2]</td>
		<td>$row[6]</td>
		<td><a href='$row[7]'>Website</a></td>
		</tr>";
	}
}
/*
//use this to print out all columns and rows
//print table head6
echo "<thead><tr>\n";
foreach ($csvArr[0] as $i => $col) {
	echo "<th>$col</th>\n";
}
echo "</tr></thead>\n";

//print table body
echo "<tbody>\n";
foreach ($csvArr as $i => $row) {
	if ($i > 0)
	{
		echo "<tr>\n";
		foreach ($row as $j => $col) {
			echo "<td>$col</td>\n";
		}
		echo "</tr>\n";
	}
}

echo "</tbody></table>\n";
*/

?>

			</tbody>
		</table>


        <h2>The Data's Details</h2>
        <p><strong>The data that we insert in the spreadsheets is the following:</strong></p>

        <ol>
	<li>The link to the digital library's website</li>
	<li>The name of the institution and the city where it is located.</li>
	<li>The number of digitized manuscripts (if available).</li>
	<li>The date the link was last tested and was working.</li>
	<li>Latitude and Longitude of the institution's location.</li>
</ol>

  <p>Finding digitized medieval manuscripts is not an easy task: the most prominent libraries are easily found and pinpointed on the maps. Problems arise for all the other digitized libraries that are not discoverable through search engines for many reasons (the website is not optimized or not accessible by crawlers and doesn't appear on web searches, the library is in a language different from English only, or, more in general, the website is difficult to access due to poor web design).</p>

 <h2>The DMMmaps' data and Crowd-Sourcing</h2>

 <p>To circumnavigate the mentioned issues, we chose to use a <strong>crowd-sourced approach:</strong></p>

<p>Anyone who is aware of a digitized library that is not on the DMMmaps, can contribute by sending us an email with the link and general info and we will proceed to insert it in the spreadsheets.</p>

        <p><strong>These maps are being developed as you read. The data and the links may not be completely reliable: </strong>Manuscripts are being digitized all the time, some libraries change their websites, others go offline. It is difficult to keep track, as imaginable.</p>

		<hr />
		<p>A project by <a href='http://sexycodicology.net/blog'>Sexy Codicology</a>.</p>
		</div>
        </div>
    <script type="text/javascript" src="../data/styles/js/bootstrap.min.js"></script>
   <script type="text/javascript">
//<![CDATA[
  (function() {
    var shr = document.createElement('script');
    shr.setAttribute('data-cfasync', 'false');
    shr.src = '//dsms0mj1bbhn4.cloudfront.net/assets/pub/shareaholic_legacy.js';
    shr.type = 'text/javascript'; shr.async = 'true';
    shr.onload = shr.onreadystatechange = function() {
      var rs = this.readyState;
      if (rs && rs != 'complete' && rs != 'loaded') return;
      var site_id = '528c47708669d3f5e561e116ce55b93c';
      try { Shareaholic.init(site_id); } catch (e) {}
    };
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(shr, s);
  })();
//]]>
</script>
	</body>
</html>
