<?php
ini_set("log_errors", "off");
header('Content-Type: application/json; Access-Control-Allow-Origin: *');
$update = json_decode(file_get_contents('php://input'));
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.telegram.org/bot' . $update->token . '/setwebhook');
$update->allowed_updates = json_encode($update->allowed_updates, true);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $update);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);
if($response['ok']){
    echo file_get_contents('https://api.telegram.org/bot' . $update->token . '/getme');
}else{
    echo json_encode($response);
}