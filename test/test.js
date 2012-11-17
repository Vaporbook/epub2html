

var converter = require('../lib/epub2html.js');

if(!process.argv[2]) {
  throw "You must supply a path to a valid EPUB file!";
}

converter.parse(process.argv[2], function (err, epubData) {
	
	var htmlData = converter.convertMetadata(epubData);
	console.log(htmlData);

});

