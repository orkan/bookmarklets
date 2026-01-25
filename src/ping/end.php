<?php
namespace Orkan;

require '../app/Ajax.php';
Ajax::init();

/* @formatter:off */
// Ajax::init([
// 	'php_ini' => [
// 		'error_log' => 'err.log',
// 	],
// ]);
/* @formatter:on */

sleep(2);

$data = 'No data!';
$data = file_get_contents( 'php://input' );

$data = json_decode( $data, true );
// $data = request_parse_body($data); // JS.FormData() -> PHP8::request_parse_body()

if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
	$out = ["\$_SERVER['REQUEST_METHOD'] === POST"];
	foreach ( $data as $k => $v ) {
		$out[] = "$k: $v";
	}
	$data = implode("\n", $out);
}

Ajax::send( $data );
