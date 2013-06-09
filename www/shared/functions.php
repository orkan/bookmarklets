<?php

// ========================
// Call: throw new Exception('My exeption');
function exception_handler($e) {
    $msg[] = $e->getMessage();
    $msg[] = 'File: ['.$e->getFile().'], Line: ['.$e->getLine().']';
    
    header('HTTP/1.1 500 Custom Exception by Orkan');
    
    $msg = implode("\n", $msg);
    echo json_encode(array('error' => $e->getMessage(), 'console' => $msg));
}

// ========================
// Ajax output
function ajax($data) {
    echo json_encode($data);
}
