<?php

// Test script to verify the API is working after fixing the database issue
echo "Testing LGU Information Management System API\n";
echo "=============================================\n\n";

// Test base URL
$baseUrl = 'http://localhost:8000/api';

// Test function
function testEndpoint($url, $description, $method = 'GET', $data = null, $headers = []) {
    echo "Testing: $description\n";
    echo "URL: $url\n";
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    if ($data && ($method === 'POST' || $method === 'PUT')) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $headers[] = 'Content-Type: application/json';
    }
    
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    echo "HTTP Status: $httpCode\n";
    
    if ($response) {
        $decodedResponse = json_decode($response, true);
        if ($decodedResponse) {
            echo "Response: " . json_encode($decodedResponse, JSON_PRETTY_PRINT) . "\n";
        } else {
            echo "Raw Response: $response\n";
        }
    } else {
        echo "No response received\n";
    }
    
    echo str_repeat("-", 50) . "\n\n";
    return $httpCode;
}

// Test 1: Check if residents endpoint is accessible (should require auth)
testEndpoint("$baseUrl/residents", "Residents Index (Should require authentication)");

// Test 2: Check duplicate endpoint (should also require auth) 
testEndpoint("$baseUrl/residents/check-duplicates", "Check Duplicates (Should require authentication)", 'POST', [
    'first_name' => 'John',
    'last_name' => 'Doe',
    'birth_date' => '1990-01-01'
]);

echo "API Test Complete!\n";
echo "Expected: Both endpoints should return 401 Unauthorized (requiring authentication)\n";
echo "This indicates the API is working but requires proper authentication tokens.\n";
