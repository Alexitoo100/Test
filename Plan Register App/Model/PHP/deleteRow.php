<?php 
$id = $_POST['id'];
$table = $_POST['table'];
$id_type = $_POST['column'];

$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");

    if ($table === 'objectives') {
        $result = pg_query($dbconn, "DELETE FROM plans WHERE id_obj_plan = '$id'");
        $result = pg_query($dbconn, "DELETE FROM $table WHERE $id_type = '$id'");
    } else if ($table === 'plans') {
        $result = pg_query($dbconn, "DELETE FROM indicator WHERE id_plan_ind = '$id'");
        $result = pg_query($dbconn, "DELETE FROM $table WHERE $id_type = '$id'");
    } else
        $result = pg_query($dbconn, "DELETE FROM $table WHERE $id_type = '$id'");

pg_close($dbconn);
?>