<?php
session_start();

// Destroy session and unset username
unset($_SESSION['username']);
session_destroy();

// Redirect to index or login page after logout
header('Location: index.html');
exit();
?>
