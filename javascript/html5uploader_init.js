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
				console.log("****** "+$id);
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
						alert('T0');
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
									alert('T1');
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
    fileTemplate += "<div class=\"progressbar\">&nbsp;</div>";
    fileTemplate += "<div class=\"filename\">{{filename}}</div>";

    fileTemplate += "<div class=\"preview\"></div>";
    fileTemplate += "</div>";

    function slugify(text)
    {
        text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        text = text.replace(/-/gi, "_");
        text = text.replace(/\s/gi, "-");
        return text;
    }

    function setProgress(name, percent) {
    	 $("#" + slugify(name)).find(".progressbar").html(Math.round(percent)+'%');

    }

    //FIXME inputs div is not updated correctly, wrong event hook

	$(".html5uploadbutton").html5Uploader({
		name: "upload",
		postUrl: "/html5upload",
		srcId: $(this).attr('id'),
		wibble: 'wobble',
		
		onClientError:function(e,file,uploaderDomElement){console.log("On client error")},
		onClientLoadEnd:function(e,file,uploaderDomElement){console.log("On client load end")},
		onClientProgress:function(e,file,uploaderDomElement){console.log("On client load progress")},
		onServerAbort:function(e,file,uploaderDomElement){console.log("On server abort")},
		onServerError:function(e,file,uploaderDomElement){console.log("On server error")},
		onServerLoad:function(e,file,uploaderDomElement){console.log("On server load")},
		onServerProgress:function(e,file,uploaderDomElement){console.log("On server progress")},
		onServerReadyStateChange:function(e,file,uploaderDomElement){
			//.log($(this));

			console.log("On server ready state change: EVENT");
			console.log(e);



			console.log("ORIG DOM ELEMENT:");
			console.log(uploaderDomElement);
			var uploaderId = uploaderDomElement.attr('id');
			//console.log(e.srcElement);
			console.log(file);

			r = $.trim(e.srcElement.response);
			r = e.srcElement.response;

//alert("RESPONSE:*"+r+'*');

			if (r) {
				if(r != 'success') {
					console.log("RESPONSE:"+r);
					file_id = eval('('+r+')').file_id;
				}
					//console.log(file_id.file_id);

					//setProgress(100); //signify done

					//console.log("OPTS");
					//console.log(opts);
					//console.log("Refresh link:"+opts.refreshlink);
					//console.log('***********');

				//FIXME - understand the id thing here instead of upload_preview_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles
				//html5Uploader
				//			$preview = $('#upload_preview_'+$e.attr('id'));

				$preview = $('#upload_preview_'+uploaderId);

				//$preview = $('#upload_preview_FileDataObjectManager_Popup_UploadifyForm_UploadedFiles');
				$inputs = $('.inputs input', $preview);
				//console.log("INPUTS");
				//console.log($inputs);	
				if($preview.length) {
					ids = new Array();
					$inputs.each(function() {
						if($(this).val().length) {
							ids.push($(this).val());
						}
					});


				if (r != 'success') {
					ids.push(file_id);
				}

				console.log(ids);

				//alert("IDS:"+ids.length);
/*
AttachedFiles[]:233
AttachedFiles[]:234
AttachedFiles[]:235

<div class="inputs">
	
		
			<input type="hidden" name="AttachedFiles[]" value="239">
		
			<input type="hidden" name="AttachedFiles[]" value="240">
		
			<input type="hidden" name="AttachedFiles[]" value="241">
		
	
</div>

*/

				if (ids.length > 0) {				
console.debug(opts);
console.debug('IDS');
console.debug(ids);
					$.ajax({
						url: opts.refreshlink,
						data: {'FileIDs' : ids.join(",")},
						async: true,
						dataType: "json",
						success: function(data, e) {
							//alert('T2');
							//$preview.html(data.html);
							console.log(data);
							console.debug(data['FileIDs']);
							// this is the image id
							var imageId = data['lastUploadedFileID'];

							// element containing the image
							var domId = 'file-'+imageId; 
							var li = document.getElementById(domId);
							
							if (li == null) {
								//upload_preview_Form_EditForm_AttachedFiles
								var uploader_id = uploaderDomElement.attr('id');
								var parentListDomId = '#uploadifyFileList'+uploader_id+' li:last-child';

								var image_class = $('#ImageClass_'+uploader_id).html();
								//alert(document.getElementById(parentListDomId));
								//alert(parentListDomId);
								//$(parentListDomId).html('*******************************');
								$(data.html).insertAfter($(parentListDomId));
							} else {
								$(domId).html(data.html);
							};

							// now we wish to update div.inputs
							preview = $('#upload_preview_'+uploaderId);

							//alert('#upload_preview_'+uploaderId);

							//alert("PREVIEW:"+preview);
							inputs = $('.inputs', preview);

							//alert(inputs.attr('id'));

							
							//inputs.attr('wibble', 'wobble');
							//inputs.html('this is a test '+imageId);

							alert('uploadifyFileList'+uploaderId);

							image_ids = [];
							html = "";
							lis = $('#uploadifyFileList'+uploaderId+ ' li').each( function(index, value) { 
			  					//if (value > 0) {
			  						var li_image_id = ($(value).attr('id'));
			  						var splits = li_image_id.split('-');
			  						if (splits.length == 2) {
				  						image_ids.push(splits[1])
				  						ht = '<input type="hidden" name="AttachedFiles[]" value="'+splits[1]+'">';
				  						html = html + ht;
				  					};
			  						//var image_id_li = value.attr(id);
			  						//alert(image_id_li); 

			  					//}
							});

							//alert(image_ids);
							inputs.html(html);

							//var li = $('file-'+)
							//upload_preview_Form_EditForm_AttachedFiles
							//uploadifyFileListForm_EditForm_AttachedFiles
						}
						});
					}
				}

				$("#" + slugify(file.name)).html('');

				
			}
		
			/*
			if(http.readyState == 4) {
    			alert(http.responseText);
  			}
  			*/




		},

		 onClientLoadStart: function (e,file,uploaderDomElement)
        {
            var upload = $("#dropboxStatus");

            console.log("Client load start");
            console.log(e);
            if (upload.is(":hidden"))
            {
                upload.show();
            }
            upload.append(fileTemplate.replace(/{{id}}/g, slugify(file.name)).replace(/{{filename}}/g, file.name));
        },
        onClientLoad: function (e, file,uploaderDomElement)
        {
        	console.log("CLIENT ON LOAD:");
        	//console.log(e);
        	//console.log(file);
            setProgress(file.name, 0);

            $domEl = $(e.currentTarget);
            console.log($domEl.attr('id'));

            //alert(file.name);
        },
        onServerLoadStart: function (e, file,uploaderDomElement)
        {
           // $("#" + slugify(file.name)).find(".progressbar").html('0%');
                            setProgress(file.name, 0);

        },

        onServerLoad: function (e, file,uploaderDomElement)
        {
        	console.log("On server load");
        	console.log(e);
        	console.log(file);

           // $("#" + slugify(file.name)).find(".progressbar").html('100%');
            setProgress(file.name, 100);

            
        },

        onServerProgress: function (e, file,uploaderDomElement)
        {
            if (e.lengthComputable)
            {
                var percentComplete = (e.loaded / e.total) * 100;
                //$("#" + slugify(file.name)).find(".progressbar").html(percentComplete+'%');
                setProgress(file.name, percentComplete);
                console.log("Uploaded "+percentComplete);
            }
        },


	});



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
		$target = $(this).parents('.UploadifyField').find('.html5uploadbutton');
		console.log("CF: TARGET");
		console.log($target);

		$folderSelect = $('#folder_select_'+$target.attr('id'));

		//$folderSelect.html('WIBBLE');

		folder_id = $('select:first', $folderSelect).val();

		console.log("FOLDER ID:"+folder_id);

		new_folder = $('input:first', $folderSelect).val();

		console.log("NEW FOLDER:"+new_folder);

		$folderSelect.parents('.folder_select_wrap').load(
			$t.metadata().url, 
			{ FolderID : folder_id, NewFolder : new_folder}
		);

		

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
		alert('T3');
		return false;
	});
});
})(jQuery);