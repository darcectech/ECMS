<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet">
    <link href="backup/font/roboto/Roboto.css" rel="stylesheet">
    <script src="action.js" defer></script>
    <script src="backup/jquery-3.2.0.js"></script>
    <script src="_wikiblurb.js"></script>
    <script src="_template.js"></script>
    <script src="jparticle.jquery.js"></script>
    <script src="thingiAdapter.js" defer></script>
    <script src="projectController.js"></script>
</head>
<body>
<nav>
    <ul>
        <li> <a href="index.html">Home </a></li>
        <li> <a href="#">Contact </a></li>
    </ul>
</nav>

<main class="column">

</main>

<div class="container wiki"><h3>About</h3></div>
<div id="wiki" class="container"></div>

<div class="container notes"><h3>Notes</h3></div>
<div id="notes" class="container">This project has no notes</div>

<br>

<div class="pContainer container">
    <div class="p65">
        <table id="downloads">
            <tr>
                <th>File</th>
                <th></th>
                <th></th>
                <th>Size</th>
            </tr>
            <?php
            function startsWithChar($needle, $haystack)
            {
                return strncmp($haystack, $needle, strlen($needle)) === 0;
            }

            function filesize_formatted($path)
            {
                $size = filesize($path);
                $units = array( 'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
                $power = $size > 0 ? floor(log($size, 1024)) : 0;
                return number_format($size / pow(1024, $power), 2, '.', ',') . ' ' . $units[$power];
            }

            foreach (scandir('other/'.$_GET['project']) as &$value) {
                if (startsWithChar('.',$value) === false && startsWithChar('CUSTOMIZE',$value) === false){
                    echo '<tr>' .
                        '<td>'.$value.'</td>'.
                        '<td><a href="customizations.php?project='.$_GET['project']."&file=".$value.'">Preview</a> </td>'.
                        '<td><a href="other/'.$_GET['project'].'/'. $value . '">Download</a></td>'.
                        '<td> '. filesize_formatted("other/".$_GET['project']."/". $value).' </td>'.
                        '</tr>';
                }
            }
            ?>
        </table>
    </div>

    <div class="p35">
        <div class="card" id="projectInfoCard">
            <img src="https://chart.apis.google.com/chart?chs=150x150&cht=qr&chl=<?php echo $_GET['project'] ?>&choe=UTF-8&chld=L|1" alt="">
            <h2><?php echo $_GET['project'] ?></h2>
            <h4></h4>
        </div>

        <div class="card" id="thingInfoCard">
            <img src="https://chart.apis.google.com/chart?chs=150x150&cht=qr&chl=www.thingiverse.com/thing:27205&choe=UTF-8&chld=L|1" alt="">
            <h2>Fully Printable Padlock by ttsalo</h2>
            <h4>www.thingiverse.com/thing:27205</h4>
            <div class="tags">
                <span class="tag">Thingiverse</span>
                <span class="tag">ttsalo</span>
                <span class="tag">27205</span>
            </div>
        </div>
    </div>

</div>

<br>


<script type="application/javascript">
    window.project_reference = (location.search || location.hash || "=baby_box").split('=')[1];
    projectController();
</script>

</body>
</html>