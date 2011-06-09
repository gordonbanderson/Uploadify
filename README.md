Uploadify HTML5 Version
=======================

This is a drop in replacement for the Flash version of Uploadify.  I was being driven mad by the HTTP Error sometimes happening with the Flash uploader, as have several others, so decided to turn to HTML5 instead.

To install this module, simple clone to a temporary directory and rename the directory cloned into from Uploadify to uploadify.  Then delete the existing Flash version of uploadify in your silverstripe install, and replace it with this one.  One can revert the change by simply restoring the Flash version of Uploadify, as no database changes are made.


Caveats
=======
Please consider this *ALPHA* software, as I wrote it in a rush to resolve a multiple image uploading issue, and was learning how Uploadify worked.  No errors are reported from uploads, and uploads also cannot be cancelled.

That said it seems to work, mostly founded on the good work by Uncle Cheese :)
