<?php

$dbconn = pg_connect("host=localhost port=15432 dbname=postgres user=postgres password=123");
$result = pg_query($dbconn, "SELECT id_objective, code, name, notes, year FROM objectives");
$rows = pg_fetch_all($result);

    echo json_encode($rows);

pg_close($dbconn);

?>