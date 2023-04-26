<?php


function guidv4($data = null) {
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    $data = $data ?? random_bytes(16);
    assert(strlen($data) == 16);

    // Set version to 0100
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    // Set bits 6-7 to 10
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

    // Output the 36 character UUID.
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");

$table = $_POST['objective-val'];

        if ($table === 'Objective') {
            $uuid_obj = guidv4();
            $code_obj = $_POST['code-objective-insert'];
            $name_obj = $_POST['name-objective-insert'];
            $year = $_POST['year-objective-insert'];
            $notes = $_POST['notes-objective-insert'];

            $result = pg_prepare($dbconn, "objectiveQuery", "SELECT id_objective, code, name, notes, year FROM objectives WHERE id_objective = $1");
            $result = pg_execute($dbconn, "objectiveQuery", array($uuid_obj));
    
        if (!$result) {
            throw new Exception('¡This objective already exist!');
        } else {
            $result2 = pg_prepare($dbconn, "insertingObjective", "INSERT INTO objectives VALUES($1, $2, $3, $4, $5)");
            $result2 = pg_execute($dbconn, "insertingObjective", array($uuid_obj, $code_obj, $name_obj, $notes, $year));
            header('location: ../../View/interface/index.html');
        }
} 


pg_close($dbconn);
?>