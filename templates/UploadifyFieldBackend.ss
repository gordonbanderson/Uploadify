<STYLE type="text/css">

	.dropboxStatus div {
		display: inline;
	}

   .progressbar {
   	display: inline;
   	//width: 180px;
   	//float: left;
   }

   .preview {
   	display: inline;
   //	flaot: left;
   }
   

   .filename {
   	display: inline;
  // 	float:left;
   	padding-left: 10px;
   }


 </STYLE>


<div class="field UploadifyField backend">
	<div class="horizontal_tab_wrap Uploadify">
	  <div class="tabNavigation clearfix">
		<label for="$id">$Title</label>



	    <ul class="navigation">
	        <li class="first"><a href="#import-$id" id="tab-import-$id"><% _t('Uploadify.CHOOSEEXISTING','Choose existing') %></a></li>        
	        <li><a href="#upload-$id" id="tab-upload-$id"><% _t('Uploadify.UPLOADNEW','Upload new') %></a></li>
	    </ul>
	  </div>
	  <div class="horizontal_tabs">
	      <div id="upload-$id" class="horizontal_tab upload">
			<div class="middleColumn">


<input id="multiple" type="file"  multiple>

<div id="dropboxStatus">&nbsp;</div>


				<div class="button_wrapper" style="display:none;">
					<a class="uploadify_button upload">$ButtonText</a>
					<div class="object_wrapper">
					
						<input type="file" style="display:none;" class="uploadify { $Metadata }" name="$Name" id="$id" />
					</div>
				</div>
				<% if CanSelectFolder %>
					<div class="folder_select_wrap" id="folder_select_wrap_{$id}">
						<% include FolderSelection %>
					</div>
				<% else %>
					<input type="hidden" id="folder_hidden_{$id}" name="FolderID" value="$CurrentUploadFolder.ID" />
				<% end_if %>			

				<div id="UploadifyFieldQueue_{$Name}" class="uploadifyfield_queue"></div>
			</div>
	      </div>
	      <div id="import-$id" class="horizontal_tab import">
			<div class="middleColumn">
				<div class="import_dropdown">
					<div class="import_message"></div>
					$ImportDropdown
					<div class="import_list"></div>
					<button type="submit" class="{'url' : '$Link(import)'}"><% _t('Uploadify.DOIMPORT','Import') %></button>					
				</div>
			</div>
	      </div>
	  </div>
	</div>
	<div class="attached_files_wrap">
		<div class="middleColumn">
			<div id="upload_preview_{$id}" class="preview">
				<% include AttachedFiles %>
			</div>
		</div>
	</div>	
	<% if DebugMode %>
		$DebugOutput
	<% end_if %>
</div>