<?php
    // Allowing access
    header("Access-Control-Allow-Origin: *");

    // Defining database connection parameters
    $hn      = 'localhost';
    $un      = 'root';
    $pwd     = 'root';
    $db      = 'okergo';
    $cs      = 'utf8';

    // Setting up the PDO parameters
    $dsn 	= "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
    $opt 	= array(
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        //  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        // PDO::ATTR_EMULATE_PREPARES   => false,
                    );
    try {
        // Creating a PDO instance (connecting to the database)
        $pdo 	= new PDO($dsn, $un, $pwd, $opt);   
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
