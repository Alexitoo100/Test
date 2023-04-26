<?php
$id = $_GET['id'];
$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$result = pg_query($dbconn, "SELECT id_plan, code, name, description, responsible, corresponsible,
goal, estimation_date, notes FROM plans WHERE id_obj_plan = '$id'");
$rows = pg_fetch_all($result);

    echo json_encode($rows);

pg_close($dbconn);

?>