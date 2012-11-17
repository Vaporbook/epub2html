
var parser = require('epub-parser');

module.exports.parse = function parse(epubfile, cb)
{

	parser.open(epubfile, cb);

};


module.exports.convertMetadata = function convertMetadata(epubData)
{

	var htmlNav = processNavMap(epubData);
	var htmlMetas = processMetas(epubData);
	var htmlMetaList = processMetasAsList(epubData);

	return {
		htmlNav: htmlNav,
		htmlMetas: htmlMetas,
		htmlMetaList: htmlMetaList
	};

}

module.exports.getFile = function getFile(filename)
{
	return parser.getZip().files[filename].data;
}

module.exports.getFiles = function getFiles()
{
	return parser.getZip().files;
}

function getPrefixes(metas) {
	var prefixes = {
		dc:'dc',
		opf:'opf',
		xsi:'xsi',
		dcterms:'dcterms'
	};
	for(prop in metas) {

		if(prop == '$') {
			// namespace abbreviations
			for(ns in metas[prop]) {

				if(metas[prop][ns]=='http://purl.org/dc/elements/1.1/') {
					prefixes.dc = ns.replace('xmlns:','');
				}
				if(metas[prop][ns]=='http://www.idpf.org/2007/opf') {
					prefixes.opf = ns.replace('xmlns:','');
				}
				if(metas[prop][ns]=='http://www.w3.org/2001/XMLSchema-instance') {
					prefixes.xsi = ns.replace('xmlns:','');
				}
				if(metas[prop][ns]=='http://purl.org/dc/terms/') {
					prefixes.dcterms = ns.replace('xmlns:','');
				}

			}
		}
	}
	return prefixes;
}

function processMetasAsList(epubData) {
	var html = '<ul>';
	var metas = epubData.raw.json.opf.metadata[0];
	var prefixes = getPrefixes(metas);

	for(prop in metas) {
		
		if(prop != '$') {

			var content = '';
			var atts = [];
			if(metas[prop][0]) {
				if(metas[prop][0].$ || metas[prop][0]._) { // complex tag
					content = (metas[prop][0]._) ?
						metas[prop][0]._ :
						metas[prop][0];

					if(metas[prop][0].$) { // has attributes
						for(att in metas[prop][0].$) {
							atts.push('data-'+att+'="'+metas[prop][0].$[att]+'"');
						}
					}

				} else { // simple tag, if object, assume empty
					content = (typeof metas[prop][0] == 'object') ? '' : metas[prop][0];
				}
			}

			var name = prop;

			html += '<li data-name="'+name+'" content="'+content+'" '+atts.join(' ')+'/>'+"\n"+
			'<span class="dc-name-label">'+name+'</span>'+'<span class="dc-content">'+content+'</span></li>'+"\n";
	
		}

	}



	html += '</ul>';

	return html;

}

function processMetas(epubData) {

	var html = '';
	var pfx = (typeof epubData.raw.json.prefixes.dcPrefix !== 'undefined') ? epubData.raw.json.prefixes.dcPrefix : '';
	var metas = epubData.raw.json.opf.metadata[0];
	var prefixes = getPrefixes(metas);

	for(prop in metas) {
		
				if(prop != '$') {
				
					//console.log(metas[prop]);
					var content = '';
					var atts = [];
					if(metas[prop][0]) {
						if(metas[prop][0].$ || metas[prop][0]._) { // complex tag
							content = (metas[prop][0]._) ?
								metas[prop][0]._ :
								metas[prop][0];

							if(metas[prop][0].$) { // has attributes
								for(att in metas[prop][0].$) {
									atts.push('data-'+att+'="'+metas[prop][0].$[att]+'"');
								}
							}

						} else { // simple tag, if object, assume empty
							content = (typeof metas[prop][0] == 'object') ? '' : metas[prop][0];
						}
					}



					html += '<meta name="DC.'+prop.replace(prefixes.dc+':','')+'" content="'+content+'" '+atts.join(' ')+'/>'+"\n";
				
				}

	}


	//console.log(prefixes);
				

	html += '';

	return html;

}

function processNavMap(epubData) {


		var htmlNav = "<ul>\n";
		var pfx = (typeof epubData.raw.json.prefixes.ncxPrefix !== 'undefined') ? epubData.raw.json.prefixes.ncxPrefix : '';
		var navPoints = epubData.raw.json.ncx[pfx+"navMap"][0][pfx+"navPoint"];
		function processNavPoint(np) {

			var text = 'Untitled';
			var src = "#";

			//console.log(np);

			if(typeof np.navLabel !== 'undefined') {
				//console.log('found navLabel');
				text = np.navLabel[0].text[0];
			}
			if(typeof np.content !== 'undefined') {
				//console.log('found content');
				src = np.content[0]["$"].src;
			}
			

			htmlNav += '<li><a href="'+src+'">'+text+'</a>';

			if(typeof np.navPoint !== 'undefined') {


				htmlNav += '<ul>';
				for(var i = 0; i < np.navPoint.length; i++) {
					processNavPoint(np.navPoint[i]);
				}
				htmlNav += '</ul>'+"\n";

			}
			htmlNav += '</li>'+"\n";

		}

		for(var np = 0; np < navPoints.length; np++) {

			processNavPoint(navPoints[np]);

		}
		htmlNav += "</ul>\n";

		return htmlNav;

}

