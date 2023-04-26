<?php
$id = $_GET['id'];
$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$result = pg_query($dbconn, "SELECT id_indicator, tracking_date, value FROM indicator WHERE id_plan_ind = '$id'");
$rows = pg_fetch_all($result);

    echo json_encode($rows);

pg_close($dbconn);

?>