<?php

$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$table = $_POST['plan-val'];

if ($table === 'Plan') {
    $ident_plan = $_POST['ident-plan-update'];
    $code_plan = $_POST['code-plan-update'];
    $name_plan = $_POST['name-plan-update'];
    $desc = $_POST['desc-plan-update'];
    $resp = $_POST['resp-plan-update'];
    $corresp = $_POST['corresp-plan-update'];
    $goal = $_POST['goal-plan-update'];
    $est_date = $_POST['estdate-plan-update'];
    $notes = $_POST['notes-plan-update'];

    $result = pg_prepare($dbconn, "updatingPlan", "UPDATE plans SET code = $1,
    name = $2, description = $3, responsible = $4, corresponsible = $5,
    goal = $6, estimation_date = $7, notes = $8 WHERE id_plan = $9");
    $result = pg_execute($dbconn, "updatingPlan", array($code_plan, $name_plan, $desc, $resp, $corresp, $goal, $est_date, $notes, $ident_plan));

    if (!$result) {
        return "error.";
    } else 
        header("location: ../../View/interface/index.html");
}

pg_close($dbconn);

?>