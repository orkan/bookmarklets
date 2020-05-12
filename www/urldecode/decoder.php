<?php
error_reporting(E_ALL ^ E_NOTICE);

require('../shared/functions.php');

xdebug_disable();
set_exception_handler('exception_handler');
// ========================
// Setup
$result = array();
$import = array();
$import['source'] = trim($_POST['source']);

function isUrl($s) {
    return strpos($s, 'http://') === 0;
}

// ========================
// Validate
if(empty($import['source'])) {
    throw new Exception('Empty input');
}
else if(!isUrl($import['source'])) {
    throw new Exception('Wrong input. Url please!');
}
$result['src'] = $import['source'];

// ========================
// Find decoder -> $result['dec']
$result['dec'] = urldecode($import['source']);

if($result['dec'] != $import['source'] && isUrl($result['dec']))
{
    $result['dec_mode'] = 'urldecode()';
}
else
{
    $result['dec'] = base64_decode($import['source']);
    
    if($result['dec'] != $import['source'] && $result['dec'] !== false && isUrl($result['dec']))
    {
        $result['dec_mode'] = 'base64_decode()';
    }
    else
    {
        $result['dec'] = $import['source'];
        $result['dec_mode'] = 'raw URL';
    }
}

// ========================
// Search query string for attached URL in entites -> $result['ent']
if($result['dec'])
{
    $arr = parse_url($result['dec']);
    $arr['query'] = str_replace('?', '&', $arr['query']); // remove multiple sub-queries
    parse_str($arr['query'], $arr);

    foreach($arr as $k => $v)
    {
        if(!isUrl($v))
        {
            if(!isUrl($v = base64_decode($v)))
            {
                continue;
            }
            else $result['ent_mode'] ='base64_decode()';
        }
        $result['ent_key'] = $k;
        $result['ent'] = $v;
        break;
    }
}
else
{
    $result['dec'] = null;
    $result['ent'] = null;
    $result['ent_key'] = 'not found';
}

// ========================
// Format Ajax JSON output
$result['status'] = "{$result['dec_mode']} => [{$result['ent_key']}] {$result['ent_mode']}";
usleep(700000);
ajax($result);
