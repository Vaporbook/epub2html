epub2html
===========

What It Does
--------------

This module is a wrapper module. It is meant to encapsulate epub-parser for systems that wish to restrusture parsed EPUB data into useful HTML document fragments. In essence, it turns Epub metadata into useful structural markup. Use it instead of epub-parser in any web-based reading system, or use it as a model for creating your own useful wrapper around epub-parser.

The #parse function wraps epub-parser's #open function, passing the callback right through to it. Pass an EPUB URL or full local filepath to it.

You can then call #getParser, #getFile, #getFiles, or #convertMetadata. The latter function returns an HTML version of some of the stored metadata suitable for insertion into the head of a web page. The #getFile and #getFiles functions return single file or entire file list, respectively, while #getParser gives you direct access to the epub-parser instantiation (instantiated AND initialized via the #open call).

Installing
-----------

    npm install epub2html





