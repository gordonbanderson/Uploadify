<div class="file_heading"><% _t('Uploadify.ATTACHEDFILES','Attached files') %></div>
<div class="upload_previews">
	ID:$id
	<ul id="uploadifyFileList$ID" class="<% if Sortable %>sortable {'url' : '$Link(dosort)'}<% end_if %>">
		<% control Files %>
			<% include AttachedFile %>
		<% end_control %>
	</ul>
	<% if Files %>

	<% else %>
	<div class="no_files">
		<% if Multi %>
			<% _t('Uploadify.NOFILES','No files attached') %>
		<% else %>
			<% _t('Uploadify.NOFILE','No file attached') %>
		<% end_if %>
	</div>
	<% end_if %>
</div>

<div class="inputs">
	<% if Files %>
	FILES:
		<% control Files %>
			<input type="text" name="<% if Top.Multi %>{$Top.Name}[]<% else %>{$Top.Name}ID<% end_if %>" value="$ID" />
		<% end_control %>
	<% end_if %>
</div>