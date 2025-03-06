<?php
session_start();

// Simulated user credentials (replace with actual validation logic)
$validUsername = 'user';
$validPassword = 'password';

// Check if username and password were submitted
if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validate credentials
    if ($username === $validUsername && $password === $validPassword) {
        // Authentication successful, store username in session
        $_SESSION['username'] = $username;
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Username and password are required']);
}
?>
