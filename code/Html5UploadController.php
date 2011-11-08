<?php
class Html5UploadController extends Controller {




	public function index(SS_HTTPRequest $r) {

		error_log("Uploading via HTML5\nFILES:");

		error_log(print_r($_FILES,1));
		error_log("/FILES");

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

			error_log(print_r($r, 1));

			$class = in_array($ext, UploadifyField::$image_extensions) ? $r->requestVar('image_class') : $r->requestVar('file_class');
			$file = new $class();

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
		**/

			if ($core_mime == 'image') {
				$trace .= ("Creating image\n    ");
				//$file = new Image();
			} else {
				$trace .= ("Creating file\n    ");
				//$file = new File();
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

			
			/*
						$file = new $class();
			$u = new Upload();
			$u->loadIntoFile($_FILES['Filedata'], $file, $upload_folder);
			$file->write();
			echo $file->ID;
			*/

			error_log("TRACE HTML5 UPLOAD");
			error_log($trace);

			echo json_encode($arr);
		} 
		else {
			error_log("Upload fields not set");
			echo 'success'; // return something or SWFUpload won't fire uploadSuccess
		}
	}



}?>