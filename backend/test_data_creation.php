<?php

require_once 'test_api_comprehensive.php';

$tester = new APITester();
$tester->login();

echo "Testing Suggestion Creation\n";
echo "===========================\n";

$suggestionData = [
    'suggester_name' => 'Test Citizen',
    'suggester_contact' => '09123456789',
    'category' => 'INFRASTRUCTURE',
    'title' => 'Improve Street Lighting',
    'description' => 'The street lighting in our area needs improvement for safety.',
    'priority_level' => 'MEDIUM'
];

$suggestionResponse = $tester->makeRequest('POST', '/suggestions', $suggestionData);
echo "Response: " . json_encode($suggestionResponse, JSON_PRETTY_PRINT) . "\n\n";

echo "Testing Appointment Creation\n";
echo "============================\n";

$appointmentData = [
    'applicant_name' => 'Test Applicant',
    'applicant_contact' => '09987654321',
    'appointment_type' => 'CONSULTATION',
    'purpose' => 'General inquiry about services',
    'appointment_date' => '2025-06-15',
    'appointment_time' => '10:00'
];

$appointmentResponse = $tester->makeRequest('POST', '/appointments', $appointmentData);
echo "Response: " . json_encode($appointmentResponse, JSON_PRETTY_PRINT) . "\n";
