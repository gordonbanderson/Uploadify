<li id="file-{$ID}" class="uploadifyFile clr">
ATTACHED FILE:$Thumb
<div class="image"><img src="$Thumb" width="32" height="32" alt="$Thumb" /></div>
<div class="filename">$Name ($ID)</div>
<div class="delete">
<% if Top.Backend %>
	<a class="remove" title="<% _t('Uploadify.REMOVE','Remove') %>" rel="$ID" title="<% _t('Uploadify.REMOVEANDDELETE','Remove') %>" href="<% control Top %>$Link(removefile)<% end_control %>"><% _t('Uploadify.DETACH','detach') %></a>&nbsp;
	<% if Top.DeleteEnabled %><a class="delete" title="<% _t('Uploadify.REMOVEANDDELETE','Remove and delete') %>" rel="$ID" title="<% _t('Uploadify.REMOVEANDDELETE','Remove and delete') %>" href="<% control Top %>$Link(deletefile)<% end_control %>"><% _t('Uploadify.DELETEPERMANENTLY','delete permanently') %></a><% end_if %>
<% else %>
	<a class="delete" title="<% _t('Uploadify.REMOVE','Remove') %>" rel="$ID" title="<% _t('Uploadify.REMOVEANDDELETE','Remove') %>" href="<% control Top %>$Link(removefile)<% end_control %>">delete permanently</a>
<% end_if %>
</div>
</li>