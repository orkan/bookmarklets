<?php
/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
namespace Orkan;

class Ajax
{
	const API_KEY_NAME = 'X-Api-Key';
	protected static $cfg;

	/**
	 * Prepare PHP environment for Ajax request.
	 * see \Orkan\Application::__construct()
	 */
	public static function init( array $cfg = [] ): void
	{
		self::setExceptionHandler();

		if ( !self::$cfg ) {
			// Merge with defaults
			self::$cfg = array_replace_recursive( self::defaults(), $cfg );

			// PHP setup
			date_default_timezone_set( self::$cfg['time_zone'] );

			foreach ( self::$cfg['php_ini'] as $k => $v ) {
				isset( $v ) && ini_set( $k, $v );
			}
		}

		self::auth();
	}

	/**
	 * Get defaults.
	 * see \Orkan\Application::defaults()
	 */
	protected static function defaults(): array
	{
		/**
		 * [api_key]
		 * Authenticate all ajax requests by comparing it with request header api key
		 * @see Ajax::API_KEY_NAME
		 *
		 * -------------------------------------------------------------------------------------------------------------
		 * PHP INI: Prepare for CLI
		 * @link https://www.php.net/manual/en/errorfunc.configuration.php
		 *
		 * Tip:
		 * Use NULL to skip set_ini()
		 *
		 * [allow_url_fopen]
		 * Allow file_get_contents('php://input') to read JS::fetch() requests.
		 * @link https://stackoverflow.com/questions/19146984/file-get-contentsphp-input-always-returns-an-empty-string
		 *
		 * [max_execution_time]
		 * Maximum script execution time. Default: 30 -OR- 0 in CLI mode!
		 *
		 * [error_reporting]
		 * Show errors, warnings and notices. Default: E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED
		 * Suggested on PROD: E_ALL & ~E_DEPRECATED & ~E_STRICT
		 *
		 * [log_errors]
		 * Log PHP errors?
		 *
		 * [log_errors_max_len]
		 * Max length of php error messages. Default: 1024, 0: disable.
		 *
		 * [ignore_repeated_errors]
		 * Repeated errors must occur in same file on same line unless ignore_repeated_source is set true.
		 *
		 * [ignore_repeated_source]
		 * Do not log errors with repeated messages from different source lines.
		 *
		 * [html_errors]
		 * Format the error message as HTML?
		 *
		 * [error_log]
		 * Path to php_error.log
		 * see Logger::__construct()
		 *
		 * @formatter:off */
		return [
			'api_key'   => null,
			'time_zone' => getenv( 'APP_TIMEZONE' ) ?: date_default_timezone_get(),
			'php_ini'   => [
				'allow_url_fopen'        => '1',
				'max_execution_time'     => null,
				'error_reporting'        => E_ALL,
				'log_errors'             => '1',
				'log_errors_max_len'     => '0',
				'ignore_repeated_errors' => '1',
				'ignore_repeated_source' => '0',
				'html_errors'            => '0',
				'error_log'              => getenv( 'LOG_FILE' ) ?: '',
			],
		];
		/* @formatter:on */
	}

	/**
	 * Turn PHP errors into Exceptions.
	 * see \Orkan\Thumbnail::errorException()
	 */
	public static function errorException( $severity, $message, $filename, $lineno ): void
	{
		// This error code is not included in error_reporting or error was suppressed with the @-operator
		if ( !( error_reporting() & $severity ) ) {
			return;
		}

		$lvl = [ E_NOTICE => 'NOTICE', E_ERROR => 'ERROR', E_WARNING => 'WARNING', E_PARSE => 'PARSE' ];
		isset( $lvl[$severity] ) && $message = "{$lvl[$severity]}: $message";

		throw new \ErrorException( $message, 0, $severity, $filename, $lineno );
	}

	/**
	 * Log exception to PHP error log.
	 * see \Orkan\Thumbnail::logException()
	 */
	protected static function logException( \Throwable $E ): void
	{
		$out = [];

		/* @formatter:off */
		foreach ([
			'Message' => $E->getMessage(),
			'REFERER' => $_SERVER['HTTP_REFERER'] ?? '',
			'REQUEST' => $_SERVER['REQUEST_URI'] ?? '',
			'Caught'  => $E,
		] as $k => $v ) {
			$out[] = "$k: $v";
		}
		/* @formatter:on */

		error_log( implode( "\n", $out ) );
	}

	/**
	 * see \Orkan\WP\AirDB\AirDB::ajaxSetExceptionHandler()
	 */
	protected static function setExceptionHandler(): void
	{
		// Turn Errors into Exceptions
		set_error_handler( [ self::class, 'errorException' ] );

		// Log & Json error
		set_exception_handler( function ( \Throwable $E ) {
			self::logException( $E ); // because we like it ;)
			self::send( get_class( $E ) . ': ' . $E->getMessage(), $E->getCode() ?: 255 ); // +die!
		} );
	}

	/**
	 * Authenticate AJAX request.
	 */
	protected static function auth(): void
	{
		/*
		 * Get request headers:
		 * @see $SERVER[HTTP_???] for most common headers
		 */
		$headers = getallheaders();

		// Validate API key
		$api = $headers[self::API_KEY_NAME] ?? '';
		$key = self::$cfg['api_key'] ?? null;
		if ( $key && $key !== $api ) {
			self::send( "Wrong Api Key: '$api'", 403 );
		}

		/**
		 * Allow CORS responce to all: * [same as] $SERVER[HTTP_ORIGIN]
		 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS
		 */
		header( 'Access-Control-Allow-Origin: *' );
	}

	/**
	 * Send JSON response and exit.
	 */
	public static function send( string $value, int $code = 0 ): void
	{
		$data = $error = null;

		if ( $code ) {
			$error = $value;
			/**
			 * Send HTTP Status code along with message.
			 * @link https://www.php.net/http_response_code
			 *
			 * Note that you can NOT set arbitrary response codes:
			 * http_response_code( $code );
			 *
			 * To send HTTP Status code with custom message use header():
			 */
			header( "HTTP/1.1 500 API error #$code" );
		}
		else {
			$data = $value;
		}

		$body = [ 'data' => $data, 'error' => $error ];
		$json = json_encode( $body );

		header( 'Content-Type: application/json; charset=utf-8' );
		echo $json;
		exit();
	}
}
