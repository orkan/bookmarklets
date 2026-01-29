<?php
namespace Orkan;

require '../app/Ajax.php';
// Ajax::init();
/* @formatter:off */
Ajax::init([
	'api_key' => 'wHoPvhRaeUTdCWT0sLFWzNgsuSHKNqpn7zlZY4DfYbM=',
// 	'php_ini' => [
// 		'error_log' => 'err.log',
// 	],
]);
/* @formatter:on */

$data = 'No data!';
$body = file_get_contents( 'php://input' );
$body = json_decode( $body, true );
// $data = request_parse_body($data); // JS.FormData() -> PHP8::request_parse_body()

if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
	/* @formatter:off */
	$out = [
		"\$_SERVER['REQUEST_METHOD']: POST",
		"\$_SERVER['HTTP_ORIGIN']: {$_SERVER['HTTP_ORIGIN']}",
	];
	/* @formatter:on */
	foreach ( $body as $k => $v ) {
		$out[] = "$k: $v";
	}
	$data = implode( "\n", $out );
}

// ------------------------------------------------------------------------------------------------
// Sleep
$value = $body['req_sleep'] ?? 0;
$value = is_numeric( $value ) ? intval( $value ) : 0;
sleep( $value );

// ------------------------------------------------------------------------------------------------
// Error
$value = $body['req_errors'] ?? 0;
$value = is_numeric( $value ) ? intval( $value ) : 0;
$code = intval( str_repeat( $value, $value + 1 ) );
$error = "JS #{$value}, PHP #{$code}";
switch ( $value )
{
	case 1:
		throw new \InvalidArgumentException( $error, $code );
	case 2:
		throw new \OutOfRangeException( $error, $code );
	case 3:
		throw new \DOMException( $error, $code );
}

// ------------------------------------------------------------------------------------------------
// AJAX
Ajax::send( $data );
