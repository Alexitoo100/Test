<?php
$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$table = $_POST['objective-val'];

if ($table === 'Objective') {
    $id_obj = $_POST['ident-objective-update'];
    $code_obj = $_POST['code-objective-update'];
    $name_obj = $_POST['name-objective-update'];
    $year = $_POST['year-objective-update'];
    $notes = $_POST['notes-objective-update'];
    
    $result = pg_prepare($dbconn, "updatingObjective", "UPDATE objectives SET year = $1, code = $2,
     name = $3, notes = $4 WHERE id_objective = $5");

    $result = pg_execute($dbconn, "updatingObjective", array($year, $code_obj, $name_obj, $notes, $id_obj));
    
    if (!$result) {
        return "error.";
    } else
        header("location: ../../View/interface/index.html");
    

}

pg_close($dbconn);



?>