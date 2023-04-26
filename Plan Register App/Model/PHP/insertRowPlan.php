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

// Connection to the database.
$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");

// Contains the plan selected.
$table = $_POST['plan-val'];
$selectedObj = $_POST['select-objective'];

if ($selectedObj === null || $selectedObj === "") 
    header('location: ../../View/interface/index.html');
else {

if ($table === 'Plan') {
    $uuid_plan = guidv4();
    $code_plan = $_POST['code-plan-insert'];
    $name_plan = $_POST['name-plan-insert'];
    $desc = $_POST['desc-plan-insert'];
    $resp = $_POST['resp-plan-insert'];
    $corresp = $_POST['corresp-plan-insert'];
    $goal = $_POST['goal-plan-insert'];
    $est_date = $_POST['estdate-plan-insert'];
    $notes = $_POST['notes-plan-insert'];

    $result = pg_prepare($dbconn, "objectiveQuery", "SELECT id_plan FROM plans 
            WHERE id_plan = $1");
            $result = pg_execute($dbconn, "objectiveQuery", array($uuid_plan));
    
    if (!$result) 
        throw new Exception('¡Plan does exist!');
    else {
        $id = pg_prepare($dbconn, "objectiveID", "SELECT id_objective FROM objectives WHERE id_objective = $1");
        $id = pg_execute($dbconn, "objectiveID", array($selectedObj));
        $result2 = pg_fetch_row($id);

        if (!$result2)
            throw new Exception('¡Objective does not exist!');
        else {
            $result2 = pg_prepare($dbconn, "insertingPlan", "INSERT INTO plans VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);");
            $result2 = pg_execute($dbconn, "insertingPlan", array($uuid_plan, $code_plan, $name_plan, $desc, $resp, $corresp, $goal, $est_date, $notes, $selectedObj));
            header("location: ../../View/interface/index.html");
        }
    }
}
}
pg_close($dbconn);


?>