// worker-conversion.js
//
// == OpenJSCAD.org, Copyright (c) 2013-2016, Licensed under MIT License
//
// Implementation of Conversion Worker Thread
//
// History:
//   2016/10/15: 0.5.2: added conversion of JSON by Z3 Dev
//   2016/06/27: 0.5.1: refactored AMF import and export by Z3 Dev
//   2016/02/02: 0.4.0: GUI refactored, functionality split up into more files, mostly done by Z3 Dev

// See ui-workers.js for helper functions
// See index.js for how to create and start this thread

// Handle the onmessage event which starts the thread
// The "event" (message) is expected to have:
//   data - an anonymous object for passing data
//   data.url      - url of the page
//   data.filename - name of the source file
//   data.source   - contents of the source file
//
// A message is posted back to the main thread with:
//   source    - source code for the editor (See logic below)
//   converted - converted code for the processor (See logic below)
// Depending on what's being converted, the two are different or the same.
//
// NOTE: Additional scripts (libraries) are imported only if necessary
onmessage = function (e) {
    var r = { source: "", converted: "", filename: "", baseurl: "", cache: false };
    if (e.data instanceof Object) {
        var data = e.data;
        if ('cache' in data) {
            r.cache = data.cache; // forward cache (gMemFS) controls
        }
        if ('baseurl' in data) {
            r.baseurl = data.baseurl;
        }
        if ('filename' in data) {
            r.filename = data.filename;
            if ('source' in data) {
                var e = data.filename.toLowerCase().match(/\.(\w+)$/i);
                e = RegExp.$1;
                switch (e) {
                    case 'amf':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/lib/sax-js-1.1.5/lib/sax.js',r.baseurl+'ojsc/jscad-parseAMF.js');
                        r.source = r.converted = OpenJsCad.parseAMF(data.source,data.filename);
                        break;
                    case 'gcode':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/openscad.js');
                        r.source = r.converted = parseGCode(data.source,data.filename);
                        break;
                    case 'obj':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/openscad.js');
                        r.source = r.converted = parseOBJ(data.source,data.filename);
                        break;
                    case 'scad':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/openscad.js',r.baseurl+'ojsc/underscore.js',r.baseurl+'ojsc/openscad-openjscad-translator.js');
                        r.source = data.source;
                        if(!r.source.match(/^\/\/!OpenSCAD/i)) {
                            r.source = "//!OpenSCAD\n"+data.source;
                        }
                        r.converted = openscadOpenJscadParser.parse(r.source);
                        break;
                    case 'stl':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/openscad.js');
                        r.source = r.converted = parseSTL(data.source,data.filename);
                        break;
                    case 'js':
                        r.source = r.converted = data.source;
                        break;
                    case 'jscad':
                        r.source = r.converted = data.source;
                        break;
                    case 'svg':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/lib/sax-js-1.1.5/lib/sax.js',r.baseurl+'ojsc/jscad-parseSVG.js');
                        r.source = r.converted = OpenJsCad.parseSVG(data.source,data.filename);
                        break;
                    case 'json':
                        importScripts(r.baseurl+'ojsc/csg.js',r.baseurl+'ojsc/openjscad.js',r.baseurl+'ojsc/jscad-parseJSON.js');
                        r.source = r.converted = OpenJsCad.parseJSON(data.source,data.filename);
                        break;
                    default:
                        r.source = r.converted = '// Invalid file type in conversion ('+e+')';
                        break;
                }
            }
        }
    }
    postMessage(r);
};