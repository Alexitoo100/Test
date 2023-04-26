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

$table = $_POST['indicator-val'];
$selectedPlan = $_POST['select-plan'];

        if ($table === 'Indicator') {
            $uuid_obj = guidv4();
            $tracking_date = $_POST['tracking-date-indicator'];
            $value = $_POST['value-indicator'];

            $result = pg_prepare($dbconn, "planQuery", "SELECT id_indicator, tracking_date, value FROM indicator WHERE id_indicator = $1");
            $result = pg_execute($dbconn, "planQuery", array($uuid_obj));
    
        if (!$result) {
            throw new Exception('¡Indicator does exist!');
        } else {
            $result2 = pg_prepare($dbconn, "insertingIndicator", "INSERT INTO indicator VALUES($1, $2, $3, $4)");
            $result2 = pg_execute($dbconn, "insertingIndicator", array($uuid_obj, $tracking_date, $value, $selectedPlan));
            header('location: ../../View/interface/index.html');
        }
} 


pg_close($dbconn);
?>