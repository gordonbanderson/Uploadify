jQuery.noConflict();

console.log('html5 init');

(function($) {
$(function() {
	$('.UploadifyField').livequery(function() {
		$(this).each(function() {
			$t = $(this);
			if(!$t.hasClass('backend')) {
				var $input = $('input.uploadify',$t);
				name = $input.attr('name');
				id = $input.attr('id');
				klass = $input.attr('class');
				var $uploader = $('<input type="hidden" class="'+klass+'" name="'+name+'" id="'+id+'" disabled="disabled"/>');
				$input.replaceWith($uploader);
			}
			else {
				$uploader = $('input.uploadify', $t);
			}			
			/**
			 Build a set of options to pass to the uploadify object
			 														**/			

			opts = $uploader.metadata();
			console.log("METADATA");
			console.log(opts);

			$.extend(opts, {
				onComplete: function(event, queueID, fileObj, response, data) {
					$e = $(event.currentTarget);
					$container = $e.parents('.UploadifyField:first');
					if(isNaN(response)) {
						alert(response);
					}
					$e = $(event.currentTarget);
					if($e.metadata().refreshlink) {
						$preview = $('#upload_preview_'+$e.attr('id'));
						$inputs = $('.inputs input', $preview);			
						if($preview.length) {
							ids = new Array();
							$inputs.each(function() {
								if($(this).val().length) {
									ids.push($(this).val());
								}
							});
							ids.push(response);
														
							$.ajax({
								url: $e.metadata().refreshlink,
								data: {'FileIDs' : ids.join(",")},
								async: false,
								dataType: "json",
								success: function(data) {
									$preview.html(data.html);
								}
							});
						}
					}
				},
				onAllComplete : function(event) {
					$e = $(event.currentTarget);
					$e.data('active',false);
					$e.parents('form').find(':submit').attr('disabled',false).removeClass('disabled');
					$container = $e.parents('.UploadifyField:first');
					$('.preview',$container).show();
					if($e.metadata().upload_on_submit) {
						$e.parents('form').submit();
					}

				},
				onSelectOnce: function(event, queueID, fileObj) {
					$e = $(event.currentTarget);
					if($('#folder_select_'+$e.attr('id')).length) {
						folder_id = $('#folder_select_'+$e.attr('id')).find('select:first').val();
					}
					else if($('#folder_hidden_'+$e.attr('id')).length) {
						folder_id = $('#folder_hidden_'+$e.attr('id')).val();
					}
					data = $e.uploadifySettings('scriptData');
					$.extend(data, {
						FolderID : folder_id
					});
					$e.uploadifySettings('scriptData', data, true);
					$e.data('active',true);
					if(!$e.metadata().upload_on_submit) {
						$e.parents('form').find(':submit').attr('disabled',true).addClass('disabled');
					}
				},
				onCancel: function(event, queueID, fileObj, data) {
					$e = $(event.currentTarget);
					if (data.fileCount == 0) {
						$e.closest('.UploadifyField').find('.preview').show().html('<div class="no_files"></div>');
						if (!$e.metadata().auto && !$e.metadata().upload_on_submit) { 
							$('.uploadifyfield_queue_actions').show(); 
						}
					}
				}
			});
			
			// Handle form submission if the upload happens on submit
			if($uploader.metadata().upload_on_submit) {
				$(this).parents('form:first').submit(function(e) {				
					cansubmit = true;
					$('input.uploadify').each(function() {
						if($(this).data('active')) {
							cansubmit = false;
							$(this).uploadifyUpload();
						}
					});
					return cansubmit;						

				});
			}

			// invoke the HTML5 uploader
			//$uploader.uploadify(opts);
			console.log("About to involder html5 uploader");
			//z = new displayMessage('wombles');
			//var uploddr = new uploader('drop', 'status', '/html5upload', 'list');



	var fileTemplate = "<div id=\"{{id}}\">";
    fileTemplate += "<div class=\"progressbar\"></div>";
    fileTemplate += "<div class=\"preview\"></div>";
    fileTemplate += "<div class=\"filename\">{{filename}}</div>";
    fileTemplate += "</div>";

    function slugify(text)
    {
        text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        text = text.replace(/-/gi, "_");
        text = text.replace(/\s/gi, "-");
        return text;
    }

	$("#dropbox, #multiple").html5Uploader({
		name: "upload",
		postUrl: "/html5upload",

		onClientLoadStart:function(e,file){console.log("On client start")},
		onClientError:function(e,file){console.log("On client error")},
		onClientLoadEnd:function(e,file){console.log("On client load end")},
		onClientProgress:function(e,file){console.log("On client load progress")},
		onServerAbort:function(e,file){console.log("On server abort")},
		onServerError:function(e,file){console.log("On server error")},
		onServerLoad:function(e,file){console.log("On server load")},
		onServerProgress:function(e,file){console.log("On server progress")},
		onServerReadyStateChange:function(e,file){
			//.log($(this));

			//console.log("On server ready state change: EVENT");
			//console.log(e);
			//console.log(e.srcElement);
			//console.log(file);

			r = e.srcElement.response;

			if (r) {
				console.log("RESPONSE:"+r);
				file_id = eval('('+r+')');
				console.log(file_id.file_id);

				// this file id is inserted into the .inputs panel with hidden IDs,
				// it will then be updated on the completion of the upload sequence

				var domel = $('#UploadFolderID_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles');
				
				var inputs = $('.inputs', domel);
				console.log(domel);
				inputs.append('<p>++++Test</p>');


				/*
				<div class="inputs">
	
		
			<input type="hidden" name="UploadedFiles[]" value="262">
		
			<input type="hidden" name="UploadedFiles[]" value="263">
		
			<input type="hidden" name="UploadedFiles[]" value="264">
		
	
</div>
*/


			}
		
			/*
			if(http.readyState == 4) {
    			alert(http.responseText);
  			}
  			*/




		},

		 onClientLoadStart: function (e, file)
        {
            var upload = $("#dropboxStatus");
            if (upload.is(":hidden"))
            {
                upload.show();
            }
            upload.append(fileTemplate.replace(/{{id}}/g, slugify(file.name)).replace(/{{filename}}/g, file.name));
        },
        onClientLoad: function (e, file)
        {
            $("#" + slugify(file.name)).find(".preview").append("<img width=\"50\" height=\"50\" src=\"" + e.target.result + "\" alt=\"\">");
        },
        onServerLoadStart: function (e, file)
        {
            $("#" + slugify(file.name)).find(".progressbar").html('0%');
        },

        onServerLoad: function (e, file)
        {
        	console.log("On server load");
        	console.log(e);
        	console.log(file);

            $("#" + slugify(file.name)).find(".progressbar").html('100%');
            alert('completed');

console.log("OPTS");
			console.log(opts);
console.log("Refresh link:"+opts.refreshlink);
				console.log('***********');

			//FIXME - understand the id thing here instead of upload_preview_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles
		
//			$preview = $('#upload_preview_'+$e.attr('id'));
			$preview = $('#upload_preview_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles');
			$inputs = $('.inputs input', $preview);
			console.log("INPUTS");
			console.log($inputs);	
			if($preview.length) {
				ids = new Array();
				$inputs.each(function() {
				if($(this).val().length) {
					ids.push($(this).val());
				}
			});
			
			//ids.push(262);
			//ids.push(263);
			//ids.push(264);

			console.log("IDS:"+ids);

			
									
			$.ajax({
				url: opts.refreshlink,
				data: {'FileIDs' : ids.join(",")},
				async: false,
				dataType: "json",
				success: function(data) {
					$preview.html(data.html);
				}
				});
			}


            $("#" + slugify(file.name)).html('');
        },

        onServerProgress: function (e, file)
        {
            if (e.lengthComputable)
            {
                var percentComplete = (e.loaded / e.total) * 100;
                $("#" + slugify(file.name)).find(".progressbar").html(percentComplete+'%');
            }
        },


	});



/*
$(function ()
{
    var fileTemplate = "<div id=\"{{id}}\">";
    fileTemplate += "<div class=\"progressbar\"></div>";
    fileTemplate += "<div class=\"preview\"></div>";
    fileTemplate += "<div class=\"filename\">{{filename}}</div>";
    fileTemplate += "</div>";

    function slugify(text)
    {
        text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        text = text.replace(/-/gi, "_");
        text = text.replace(/\s/gi, "-");
        return text;
    }
    $("#dropbox").html5Uploader(
    {
       
        
        
       
    });
    $(".download").mousedown(function ()
    {
        $(this).css(
        {
            "background-image": "url('images/download-clicked.png')"
        });
    }).mouseup(function ()
    {
        $(this).css(
        {
            "background-image": "url('images/download.png')"
        });
    }); 
});
*/

			console.log("invoked html5 uploader");





			// Build the "fake" CSS button
			var $buttonWrapper = $('.button_wrapper', $t);
			var $fakeButton = $(".button_wrapper a",$t);
			var width = $fakeButton.outerWidth();
			var height = $fakeButton.outerHeight();
			opts.width = width;
			opts.height = height;
			$buttonWrapper.css("width", width + "px").css("height", height + "px")			
			
			// Activate uploadify
			// Tabs for the backend
			if($t.find('.horizontal_tab_wrap').length) {
		      $tabSet = $t.find('.horizontal_tab_wrap');
		      var tabContainers = $('div.horizontal_tabs > div', $tabSet);
		      tabContainers.hide().filter(':last').show();
		      
		      $('div.tabNavigation ul.navigation a', $tabSet).live("click",function () {		      
		          tabContainers.hide();
		          tabContainers.filter(this.hash).show();
		          $(this).parents('ul:first').find('.selected').removeClass('selected');
		          $(this).addClass('selected');
		          return false;
		      });
		      
		      $('div.tabNavigation ul.navigation a:last', $tabSet).click();			
			}
			
			
						
		});
	});
	
	/**
	 Attach behaviours external to the uploader, e.g. queue functions
	 																	**/
	
	// Delete buttons for the queue items
	$('.upload_previews li .delete a').live("click", function() {
		$t = $(this);
		$.post(
			$t.attr('href'),
			{'FileID' : $t.attr('rel')},
			function() {
				$t.parents("li:first").fadeOut(function() {
					$(this).remove();
					$('.inputs input[value='+$t.attr('rel')+']').remove();
				});
			}
		);
		return false;
	});

	
	// Change folder ajax post
	$('.folder_select').find(':submit').live("click", function() {
		console.log("Changing folder");
		$t = $(this);
		$target = $(this).parents('.UploadifyField').find('.uploadify');
		$folderSelect = $('#folder_select_'+$target.attr('id'));
		folder_id = $('select:first', $folderSelect).val();
		new_folder = $('input:first', $folderSelect).val();
		$folderSelect.parents('.folder_select_wrap').load(
			$t.metadata().url, 
			{ FolderID : folder_id, NewFolder : new_folder}
		);

		// change the post URL of the html5 uploader to ensure the correct folder is used
		//html5uploader.postUrl = '/html5upload?FolderID='+
		//$('#UploadFolderID_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles').val();

		return false;
	});
	$('.folder_select :submit').livequery(function() {
		$(this).siblings('label').hide();
	});
	
	// Attach sorting, if multiple uploads
	$('.upload_previews ul.sortable').livequery(function() {
		var $list = $(this);
		var meta = $list.metadata();
		$list.sortable({
			update: function(e) {
				$.post(meta.url, $list.sortable("serialize"));
			},
			containment : 'document',
			tolerance : 'intersect'
		});
	});

	
	$('.import_dropdown select').livequery("change", function() {
		$t = $(this);
		$target = $t.parents('.import_dropdown').find('.import_list');
		$t.parents('.import_dropdown').find('button').hide();
		$target.html('').addClass('loading').show().css('height','50px');
		$.ajax({
			url : $t.metadata().url,
			data : { FolderID : $t.val() },
			success : function(data) {
				$target.slideUp(function() {
					$(this).removeClass('loading').css({'height' : 'auto', 'max-height' : '150px','overflow' : 'auto'});
					$(this).html(data);
					if($('input', $(this)).length) {
						$t.parents('.import_dropdown').find('button').show();
					}
					$(this).slideDown();		
				});	
			}
		});
	});
	
	$('.import_dropdown button').live("click", function() {
		url = $(this).metadata().url;
		$target = $(this).parents('.UploadifyField').find('.preview');
		$uploader = $(this).parents('.UploadifyField').find('.uploadify'); 
		$list = $(this).parents('.import_dropdown');
		ids = new Array();
		$target.find('input').each(function() {
			if($(this).val().length) {
				ids.push($(this).val());
			}
		});
		$list.find(':checked').each(function() {
			ids.push($(this).val());
		});
		$.ajax({
			url: $uploader.metadata().refreshlink,
			data: {'FileIDs' : ids.join(",")},
			dataType : "json",
			success: function(data) {
				$target.html(data.html);
				$msg = $list.find('.import_message');
				$msg.html(data.success).fadeIn();
				setTimeout(function() {
					$msg.fadeOut()
				},5000);
				$list.find('select').val('');
				$list.find('button').hide();
				$list.find('.import_list').slideUp();
				
			}
		});
		return false;
	});
});
})(jQuery);