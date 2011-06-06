<?php
class Html5UploadController extends Controller {




	public function index(SS_HTTPRequest $r) {

		$trace = ("UPLOAIFY UPLOADER\n    ");
		if(isset($_FILES["upload"]) && is_uploaded_file($_FILES["upload"]["tmp_name"])) {
			$trace .= ("FIrst vars ok\n    ");
			$upload_folder = urldecode($r->requestVar('uploadFolder'));

			$folder = null;

			if(isset($_REQUEST['FolderID'])) {
				$trace .= ("FOLDER:".$_REQUEST['FolderID']."\n    ");
				if($folder = DataObject::get_by_id("Folder", Convert::raw2sql($_REQUEST['FolderID']))) {
					$trace .= ("Getting folder\n    ");
					$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
					$trace .= ("FOLDER FROM PARAM:".$upload_folder."\n    ");
				}
			}

			$trace .= ("UPLOAD FOLDER:".$upload_folder."\n    ");


 
			$ext = strtolower(end(explode('.', $_FILES['upload']['name'])));

			$trace .= ("EXTENSION:".$ext."\n    ");


			$mime_type = $_FILES['upload']['type'];
			$mime_parts = split('/', $mime_type);
			$core_mime = $mime_parts[0];
			$trace .= ("Core mime:".$core_mime."\n    ");


			$file = null;

			if ($core_mime == 'image') {
				$trace .= ("Creating image\n    ");
				$file = new Image();
			} else {
				$trace .= ("Creating file\n    ");
				$file = new File();
			}


			
			$u = new Upload();
			$trace .= ("About to load into $upload_folder\n    ");
			$trace .= (print_r($_FILES, 1))."\n    ";


			$u->loadIntoFile($_FILES['upload'], $file, $upload_folder);
			$trace .= ("Loaded into file\n    ");

			if ($folder) {
				$trace .= ("Setting parent id from folder id ".$folder->ID."\n    ");

				$file->ParentID = $folder->ID;
			}


			$file->write();

			$trace .= ("FILE ID:".$file->ID)."\n    ";


			$arr = array ('file_id'=>$file->ID, 'trace' => $trace);

			echo json_encode($arr);


			error_log($trace);

		} 
		else {
			echo ' '; // return something or SWFUpload won't fire uploadSuccess
		}	
	}



	//accessible via /html5upload

	public function indexOLD(SS_HTTPRequest $r) {

		$trace .= ("ASSETS DIR:".ASSETS_DIR);
		$trace .= ("BASE FOLDER:".Director::baseFolder());
		$trace .= ("UPLOAIFY UPLOADER FOR HTML5");

		$assets_folder_fs = Director::baseFolder().'/'.ASSETS_DIR.'';
		$upload_folder = $assets_folder_fs.'/flickr';
$trace .= ('T1');

		if(isset($_REQUEST['FolderID'])) {
			$trace .= ("**** FOLDER ID SET ON UPLOAD".Convert::raw2sql($_REQUEST['FolderID']));
			if($folder = DataObject::get_by_id("Folder", Convert::raw2sql($_REQUEST['FolderID']))) {
				$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
			}
		
		}

$trace .= ('T2');

//folder = $folder = DataObject::get_by_id('Folder', 208);
		$trace .= ("post get folder");

		//FIXME - hardwired for testing
		if(isset($folder)) {
			$trace .= ("Found folder");
			$upload_folder = UploadifyField::relative_asset_dir($folder->Filename);
		} else {
			return 'error';//FIXME better error reporting
		}

$trace .= ("T3");	
	

		$trace .= ("UPLOAD FOLDER:".$upload_folder);

		if(count($_FILES)>0) {
			$trace .= ("FILES T1");
			$trace .= ("MOVING FROM:". $_FILES['upload']['tmp_name']);
			$to_path = $assets_folder_fs.'/'.$upload_folder.$_FILES['upload']['name'];
			$trace .= ("TO:".$to_path );
        	if( move_uploaded_file( $_FILES['upload']['tmp_name'] , $to_path ) ) {
                $trace .= ("FILES T1a");
        	}
        	$trace .= ("FILES T2");


        	$ext = strtolower(end(explode('.', $_FILES['upload']['name'])));
        	$trace .= ("EXT:".$ext);

        	$trace .= ("image extensions");
        	$trace .= (print_r(UploadifyField::$image_extensions, 1));
        	$trace .= ('Image class');
        	$trace .= ($r->requestVar('imageClass'));
        	$trace .= ('File class');
        	$trace .= ($r->requestVar('fileClass'));
			$class = in_array($ext, UploadifyField::$image_extensions) ? $r->requestVar('imageClass') : $r->requestVar('fileClass');

			$trace .= ("CLAZZ:".$class);

			/*
			  $image = new Image();
                $image->Name = $this->Title;
                $image->Title = $this->Title;
                $image->Filename = str_replace('../', '', $structure.'/'.$fpid.".jpg");
                $trace .= ("Setting title to ".$flickrPhoto->Title);
                $image->Title = $flickrPhoto->Title;
                //$image->Name = $flickrPhoto->Title;
                $image->ParentID = $flickrSet->AssetFolderID;

                $image->write();

                 Array\n    (\n        [upload] => Array\n            (\n                [name] => IMG_9113.JPG\n                [type] => image/jpeg\n                [tmp_name] => /tmp/phpKmjlva\n                [error] => 0\n                [size] => 631931\n            )\n    \n    )\n    , referer: http://tripodtravel.silverstripe/admin/assets/EditForm/field/Files/upload?SecurityID=5bbf8d7054b5d0a6fe4e3e1a32596b9473a8c66d


               */

			//$file = new $class();

			$trace .= ("FILES:");
			$trace .= (print_r($FILES,1));

			$name = $_FILES['upload']['name'];
			$mime_type = $_FILES['upload']['type'];
			$mime_parts = split('/', $mime_type);
			$core_mime = $mime_parts[0];
			$trace .= ("Core mime:".$core_mime);


			$file = null;

			if ($core_mime == 'image') {
				$trace .= ("Creating image");
				$file = new Image();
			} else {
				$trace .= ("Creating file");
				$file = new File();
			}


		
//echo $file->ID;

/*


			$trace .= ("Core file object created:".$file);

			$file->Title = $name;
			$file->Name = $name;


			$trace .= ("name and title set");


			//$relativeUploadFolder = str_replace(Director::baseFolder().'/'.ASSETS_DIR, $upload_folder.'/'.$name);

			//$trace .= ("rel upload folder:".$relativeUploadFolder);

			//filename path should be likes of assets/path/to/imagefile.jpg

//			$relative_file_path = $to_path;
			$relative_file_path = ASSETS_DIR.str_replace($assets_folder_fs, '', $to_path);

			$trace .= ("assets path:".$assets_folder_fs);
			$trace .= ("Rel assets path:".$relative_file_path);


			$file->Filename = $relative_file_path;

*/
			$trace .= ("UNPOPULATED FILE:".$file);

			//$u = new Upload();
			//$trace .= ("UPLOAD:".$u);


			$trace .= (print_r($_FILES,1));

			// set the parent id
			if ($folder) {
				$file->ParentID = $folder->ID;
			}


			//$upload_folder = $assets_folder_fs.'/'.$upload_folder.$_FILES['upload']['name'];
			
			$trace .= ("UPLOAD FOLDER:".$upload_folder);


			$trace .= ("UPLOAD - loading file into ********");
			$trace .= (print_r($_FILES['upload'],1));

			$u = new Upload();
			$u->loadIntoFile($_FILES['upload'], $file, $upload_folder);
			$file->write();
			$trace .= ("FILE ID:".$file->ID);

			$arr = array ('file_id'=>$file->ID);

			echo json_encode($arr);




        	exit();
		} else if(isset($_GET['up'])) {
			$trace .= ("T3");
        if(isset($_GET['base64'])) {
        	$trace .= ("T4");
                $content = base64_decode(file_get_contents('php://input'));
        } else {
        	$trace .= ("T5");
                $content = file_get_contents('php://input');
        }

        $trace .= ("T6");

        $headers = getallheaders();
        $headers = array_change_key_case($headers, CASE_UPPER);

        $trace .= ("T7");

        if(file_put_contents($upload_folder.'/'.$headers['UP-FILENAME'], $content)) {
                $trace .= ("T8");
        }
        exit();
}
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
?>