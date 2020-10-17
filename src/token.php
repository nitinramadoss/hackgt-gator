<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_HTTPHEADER => array(
    "Accept: application/json",
    "Ocp-Apim-Subscription-Key: 82c23b320e5e47f48e17d2216ee56f4e"
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
