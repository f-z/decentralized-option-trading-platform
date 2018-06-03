<?php
    header('Access-Control-Allow-Origin: *');

    $hn      = 'okergo.mysql.database.azure.com';
    $un      = 'okergo@okergo';
    $pwd     = 'ThelwLamboGrylle!';
    $db      = 'okergo';
    $cs      = 'utf8';

    $dsn 	= "mysql:host=" . $hn . ";port=3306;dbname=" . $db . ";charset=" . $cs;
    $opt 	= array(
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                        PDO::MYSQL_ATTR_SSL_CA => getenv('MYSQL_SSL_CA')
                    );
    try {
        $pdo 	= new PDO($dsn, $un, $pwd, $opt);   
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
?>
