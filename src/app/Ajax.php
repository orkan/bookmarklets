<?php
/*
 * This file is part of the @orkans/bookmarklets package.
 * Copyright (c) 2026 Orkan <orkans+bookmarklets@gmail.com>
 */
namespace Orkan;

class Ajax
{
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
	}

	/**
	 * Get defaults.
	 * see \Orkan\Application::defaults()
	 */
	protected static function defaults(): array
	{
		/**
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
	public static function logException( \Throwable $E ): void
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
	public static function setExceptionHandler(): void
	{
		// Turn Errors into Exceptions
		set_error_handler( [ self::class, 'errorException' ] );

		// Log & Json error
		set_exception_handler( function ( \Throwable $E ) {
			self::logException( $E ); // because we like it ;)
			self::send( $E->getMessage(), $E->getCode() ?: 255 ); // +die!
		} );
	}

	/**
	 * Send JSON response and exit.
	 */
	public static function send( string $value, int $code = 0 ): void
	{
		header( 'Content-Type: application/json; charset=utf-8' );
		echo json_encode( [ 'data' => $code ? null : $value, 'error' => $code ? $value : null ] );
		exit( $code );
	}
}
