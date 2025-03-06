<?php
session_start();

if (isset($_SESSION['username'])) {
    echo 'Welcome, ' . $_SESSION['username'] . '! <a href="logout.php">Logout</a>';
} else {
    echo '<a href="#" id="login-link">Login</a>';
}
?>
