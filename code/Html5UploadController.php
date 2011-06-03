<?php

class Html5UploadController extends Controller {

	//accessible via /html5upload

	public function index(SS_HTTPRequest $r) {

		error_log("ASSETS DIR:".ASSETS_DIR);
		error_log("BASE FOLDER:".Director::baseFolder());
		error_log("UPLOAIFY UPLOADER FOR HTML5");

		$assets_folder_fs = Director::baseFolder().'/'.ASSETS_DIR.'';
		$upload_folder = $assets_folder_fs.'/flickr';
error_log('T1');

		if(isset($_REQUEST['FolderID'])) {
			error_log("**** FOLDER ID SET ON UPLOAD".Convert::raw2sql($_REQUEST['FolderID']));
			if($folder = DataObject::get_by_id("Folder", Convert::raw2sql($_REQUEST['FolderID']))) {
				$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
			}
		
		}

error_log('T2');

//folder = $folder = DataObject::get_by_id('Folder', 208);
		error_log("post get folder");

		//FIXME - hardwired for testing
		if(isset($folder)) {
			error_log("Found folder");
			$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
		} else {
			return 'error';//FIXME better error reporting
		}

error_log("T3");	
	

		error_log("UPLOAD FOLDER:".$upload_folder);

		if(count($_FILES)>0) {
			error_log("FILES T1");
			error_log("MOVING FROM:". $_FILES['upload']['tmp_name']);
			$to_path = $assets_folder_fs.'/'.$upload_folder.$_FILES['upload']['name'];
			error_log("TO:".$to_path );
        	if( move_uploaded_file( $_FILES['upload']['tmp_name'] , $to_path ) ) {
                echo 'done';
                error_log("FILES T1a");
        	}
        	error_log("FILES T2");


        	$ext = strtolower(end(explode('.', $_FILES['upload']['name'])));
        	error_log("EXT:".$ext);

        	error_log("image extensions");
        	error_log(print_r(UploadifyField::$image_extensions, 1));
        	error_log('Image class');
        	error_log($r->requestVar('imageClass'));
        	error_log('File class');
        	error_log($r->requestVar('fileClass'));
			$class = in_array($ext, UploadifyField::$image_extensions) ? $r->requestVar('imageClass') : $r->requestVar('fileClass');

			error_log("CLAZZ:".$class);

			/*
			  $image = new Image();
                $image->Name = $this->Title;
                $image->Title = $this->Title;
                $image->Filename = str_replace('../', '', $structure.'/'.$fpid.".jpg");
                error_log("Setting title to ".$flickrPhoto->Title);
                $image->Title = $flickrPhoto->Title;
                //$image->Name = $flickrPhoto->Title;
                $image->ParentID = $flickrSet->AssetFolderID;

                $image->write();

                 Array\n(\n    [upload] => Array\n        (\n            [name] => IMG_9113.JPG\n            [type] => image/jpeg\n            [tmp_name] => /tmp/phpKmjlva\n            [error] => 0\n            [size] => 631931\n        )\n\n)\n, referer: http://tripodtravel.silverstripe/admin/assets/EditForm/field/Files/upload?SecurityID=5bbf8d7054b5d0a6fe4e3e1a32596b9473a8c66d


               */

			//$file = new $class();

			$name = $_FILES['upload']['name'];
			$mime_type = $_FILES['upload']['type'];
			$mime_parts = split('/', $mime_type);
			$core_mime = $mime_parts[0];
			error_log("Core mime:".$core_mime);


			$file = null;

			if ($core_mime == 'image') {
				error_log("Creating image");
				$file = new Image();
			} else {
				error_log("Creating file");
				$file = new File();
			}


			error_log("Core file object created:".$file);

			$file->Title = $name;
			$file->Name = $name;


			error_log("name and title set");


			//$relativeUploadFolder = str_replace(Director::baseFolder().'/'.ASSETS_DIR, $upload_folder.'/'.$name);

			//error_log("rel upload folder:".$relativeUploadFolder);

			//filename path should be likes of assets/path/to/imagefile.jpg

//			$relative_file_path = $to_path;
			$relative_file_path = ASSETS_DIR.str_replace($assets_folder_fs, '', $to_path);

			error_log("assets path:".$assets_folder_fs);
			error_log("Rel assets path:".$relative_file_path);


			$file->Filename = $relative_file_path;


			error_log("FILE:".$file);

			//$u = new Upload();
			//error_log("UPLOAD:".$u);


			error_log(print_r($_FILES,1));

			// set the parent id
			if ($folder) {
				$file->ParentID = $folder->ID;
			}

			
			$file->write();

			error_log("FILE ID:".$file->ID);
			echo $file->ID;



        	exit();
		} else if(isset($_GET['up'])) {
			error_log("T3");
        if(isset($_GET['base64'])) {
        	error_log("T4");
                $content = base64_decode(file_get_contents('php://input'));
        } else {
        	error_log("T5");
                $content = file_get_contents('php://input');
        }

        error_log("T6");

        $headers = getallheaders();
        $headers = array_change_key_case($headers, CASE_UPPER);

        error_log("T7");

        if(file_put_contents($upload_folder.'/'.$headers['UP-FILENAME'], $content)) {
                error_log("T8");
                echo '';
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
