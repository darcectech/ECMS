<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <link rel="stylesheet" href="ojsc.css">
    <link href="backup/font/roboto/Roboto.css" rel="stylesheet">
    <script src="backup/jquery-3.2.0.js"></script>
    <script src="_template.js"></script>

    <script src="ojsc/csg.js?0.5.2"></script>
    <script src="ojsc/lightgl.js"></script>
    <script src="ojsc/formats.js?0.5.2"></script>
    <script src="ojsc/openjscad.js?0.5.2"></script>
    <script src="ojsc/jscad-worker.js?0.5.2" charset="utf-8"></script>
    <script src="ojsc/jscad-function.js?0.5.2" charset="utf-8"></script>
    <script src="ojsc/openscad.js?0.5.2"></script>
    <script src="ojsc/underscore.js"></script>
    <script src="ojsc/openscad-openjscad-translator.js"></script>
    <script src="ojsc/jquery.hammer.js"></script>

<!--    <script src="ojsc/worker_conversion.js"></script>-->
    <script src="ojsc/ui_cookies.js"></script>
    <script src="ojsc/ui_worker.js"></script>
</head>
<body>
<nav>
    <ul>
        <li> <a href="index.html">Home </a></li>
        <li> <a href="#">Contact </a></li>
    </ul>
</nav>

<!--<div>-->
<!--    <img src="https://placeholdit.imgix.net/~text?txtsize=50&txt=Hero+Placeholder&w=2048&h=800">-->
<!--</div>-->

<div class="fmatch">
    <!-- design viewer -->
    <div oncontextmenu="return false;" id="viewerContext"></div> <!-- avoiding popup when right mouse is clicked -->

    <!-- design parameters -->
    <div id="parametersdiv"></div>
    <div id="selectdiv"></div>
</div>

<div class="floater">
    <h3>Preview</h3>
    <?php
    function startsWithChar($needle, $haystack)
    {
        return strncmp($haystack, $needle, strlen($needle)) === 0;
    }

    foreach (scandir('other/'.$_GET['project']) as &$value) {
        if (startsWithChar('.',$value) === false && startsWithChar('CUSTOMIZE',$value) === false){
            $n = $_GET['project'];
            echo "<button onclick='loadViewerFromFile(\"other/$n/$value\")'>$value</button>";
        }
    }
    ?>
</div>

<script>
    OpenJsCad.AlertUserOfUncaughtExceptions();

    gProcessor = new OpenJsCad.Processor(document.getElementById("viewerContext"));


    function loadViewerFromFile(filepath){

//        $.get(filepath,function(data){
//            alert(data);
//        });

        let xhr = new XMLHttpRequest();
        xhr.open("GET", filepath, true);
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
        xhr.onload = function() {
            let source = this.responseText;
            _includePath = filepath.replace(/\/[^\/]+$/,'/');


            let worker = OpenJsCad.createConversionWorker();
            let u = gProcessor.baseurl;
            // NOTE: cache: false is set to allow evaluation of 'include' statements
            worker.postMessage({baseurl: u, source: source, filename: filepath, cache: false});
        };
        xhr.send();
    }

    <?php
        $n = $_GET['project'];
        $f = $_GET['file'];
        if (!empty($f)) {
            echo 'loadViewerFromFile("other/'.$n.'/'.$f.'")';
        }
    ?>

</script>

</body>
</html>