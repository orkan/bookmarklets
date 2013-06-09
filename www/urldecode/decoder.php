<?php
error_reporting(E_ALL ^ E_NOTICE);

require('../shared/functions.php');

xdebug_disable();
set_exception_handler('exception_handler');

// ========================
// Setup
$result = array();
$import = array();
$import['decoding'] = $_POST['decoding'];
$import['entity'] = $_POST['entity'] == 'custom' ? $_POST['entity_custom'] : '';
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
switch($import['decoding'])
{
    case 'url':
        $result['dec'] = urldecode($import['source']);
        $result['inf'] = 'urldecode()';
        break;

    case 'b64':
        $result['dec'] = base64_decode($import['source']);
        $result['inf'] = 'base64_decode()';
        break;

    default:
        $result['dec'] = urldecode($import['source']);
        
        if($result['dec'] != $import['source'] && isUrl($result['dec']))
        {
            $result['inf'] = 'urldecode()';
        }
        else
        {
            $result['dec'] = base64_decode($import['source']);
            
            if($result['dec'] != $import['source'] && $result['dec'] !== false && isUrl($result['dec']))
            {
                $result['inf'] = 'base64_decode()';
            }
            else
            {
                $result['dec'] = $import['source'];
                $result['inf'] = 'raw URL';
            }
        }
        $result['url_mode'] = '(auto)';
}

// ========================
// Search entities for second URL -> $result['ent']
if($result['dec'])
{
    $arr = parse_url($result['dec']);
    $arr['query'] = str_replace('?', '&', $arr['query']); // remove multiple sub-queries
    parse_str($arr['query'], $arr);

    if($import['entity'])
    {
        $result['ent_key'] = $import['entity'];
        $result['ent'] = $arr[$import['entity']];
        
        if(!isUrl($result['ent']))
        {
            $result['ent'] = base64_decode($result['ent']);
            $result['inf_ent'] ='base64_decode()';
        }
    }
    else
    {
        foreach($arr as $k => $v)
        {
            if(!isUrl($v))
            {
                if(!isUrl($v = base64_decode($v)))
                {
                    continue;
                }
                else $result['inf_ent'] ='base64_decode()';
            }
            $result['ent_key'] = $k;
            $result['ent'] = $v;
            break;
        }
        $result['ent_mode'] = '(auto)';
    }
}
else
{
    $result['dec'] = null;
    $result['ent'] = null;
    $result['ent_key'] = $import['entity'];
}

// ========================
// Format Ajax JSON output
$result['status'] = "{$result['url_mode']} {$result['inf']}, entity: {$result['ent_mode']} [{$result['ent_key']}] {$result['inf_ent']}";
ajax($result);
