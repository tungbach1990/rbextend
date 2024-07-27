<?php
/**
 * !!!IMPORTANT - use to run somewhere on client roBrowser
 * Class for Server function
 */
class SERVER
{
    public function GetREST($query) {
        $url = "https://thien-phong.com/rojor/REST.php?".$query;
        $ch = curl_init($url);
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_USERAGENT => 'Viblo test cURL Request',
            CURLOPT_SSL_VERIFYPEER => false
        ));
        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return json_decode($res);
    }
}