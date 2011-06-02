<?php

class Html5UploadController extends Controller {

	//accessible via /html5upload

	public function index(SS_HTTPRequest $r) {
		error_log("UPLOAIFY UPLOADER FOR HTML5");

		$upload_folder = '/tmp';

		if(count($_FILES)>0) {
        	if( move_uploaded_file( $_FILES['upload']['tmp_name'] , $upload_folder.'/'.$_FILES['upload']['name'] ) ) {
                echo 'done';
        	}
        	exit();
		} else if(isset($_GET['up'])) {
        if(isset($_GET['base64'])) {
                $content = base64_decode(file_get_contents('php://input'));
        } else {
                $content = file_get_contents('php://input');
        }

        $headers = getallheaders();
        $headers = array_change_key_case($headers, CASE_UPPER);

        if(file_put_contents($upload_folder.'/'.$headers['UP-FILENAME'], $content)) {
                echo 'done';
        }
        exit();
}

echo "alert('uploaded');";

		/*
		if(isset($_FILES["Filedata"]) && is_uploaded_file($_FILES["Filedata"]["tmp_name"])) {
			$upload_folder = urldecode($r->requestVar('uploadFolder'));
			if(isset($_REQUEST['FolderID'])) {
				if($folder = DataObject::get_by_id("Folder", Convert::raw2sql($_REQUEST['FolderID']))) {
					$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
				}
			}
			$ext = strtolower(end(explode('.', $_FILES['Filedata']['name'])));
			$class = in_array($ext, UploadifyField::$image_extensions) ? $r->requestVar('imageClass') : $r->requestVar('fileClass');
			$file = new $class();
			$u = new Upload();
			$u->loadIntoFile($_FILES['Filedata'], $file, $upload_folder);
			$file->write();
			echo $file->ID;
		} 
		else {
			echo ' '; // return something or SWFUpload won't fire uploadSuccess
		}	
		*/
	}
}
