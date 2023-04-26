<?php
$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$table = $_POST['indicator-val'];

if ($table === 'Indicator') {
    $id_indicator = $_POST['ident-indicator-update'];
    $date = $_POST['track-date-update'];
    $value = $_POST['value-update'];
    
    $result = pg_prepare($dbconn, "updatingIndicator", "UPDATE indicator SET tracking_date = $1, value = $2 WHERE id_indicator = $3");

    $result = pg_execute($dbconn, "updatingIndicator", array($date, $value, $id_indicator));
    
    if (!$result) {
        return "error.";
    } else
        header("location: ../../View/interface/index.html");
    

}

pg_close($dbconn);



?>