<?php

if(isset($_POST['PHPSESSID'])) {
	Session::start($_POST['PHPSESSID']);
}


// html5 upload posting of files
Director::addRules(10, array(
'html5upload' => 'Html5UploadController'
));

