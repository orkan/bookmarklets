<?php 
// http://www.amateurcurves.com/out.php?p=65797&t=371288&pct=55&u=http%3A%2F%2Fhosted.met-art.com%2FFull_met-art_ry_207_60%2F%3Fpa%3D1187910
// http://www.debabe.com/st/st.php?id=11472&url=http://fhg.dominatedgirls.com/46060/index.html?nats=freporn:partner:dg,0,0,0,&p=100
// http://teendesert.com/st/st.php?id=125795&p=60&url=aHR0cDovL3d3dy5zZWFubmF0ZWVuLmNvbS9ob3N0ZWQvZ2FsL3N0XzAwMTYvMTU0NDI0Mw==
// http://fucked-angel.com/sr/out.php?l=0.1.6.1625.17672&u=at3/out.cgi?u=http://tgp.daddys-pet.com/1passforallsites/g1250455769/index.html
//sleep(2);

$decoder	= in_array($_POST['dec'], array('b64','url')) ? $_POST['dec'] : 'def';
$entity		= $_POST['ent']=='fix' ? $_POST['dec_entity'] : '';
$url		  = trim($_POST['url_text']);

$json = array();

if(empty($url)) {
  $json['err'][] = 'No URL string to parse';
  send_results();
  exit;
}

$json['data']['src'] = $url;

// Find decoder
switch($decoder)
{
  case 'url':
  $out = urldecode($url);
  $json['method'] = '[forced] urldecode()';
  break;

  case 'b64':
  $out = base64_decode($url);
  $json['method'] = '[forced] base64_decode()';
  break;

  default:
  if(($out = urldecode($url)) != $url && strpos($out, 'http://')===0) {
    $decoder = 'url';
    $json['method'] = '[auto] urldecode()';
  }
  elseif(($out = base64_decode($url)) != $url && $out !== false && strpos($out, 'http://')===0) {
    $decoder = 'b64';
    $json['method'] = '[auto] base64_decode()';
  }
  else {
    $out = '';
    $json['method'] = 'unknown decoding';
  }
  break;
}
if(empty($out)) $out = $url;


$json['data']['dec'] = $out != $url ? $out : null;


/* 
 * Find url in entities
 */
$arr = parse_url($out);
$arr['query'] = str_replace('?', '&', $arr['query']); // remove multiple sub-queries
parse_str($arr['query'], $arr);

if($entity)
{
  $url2 = $arr[$entity];
}
else
{
  foreach($arr as $k => $v)
  {
    if(strpos($v, 'http://')!==0)
      if(!(strpos($v = base64_decode($v), 'http://')===0 && $json['method'] = '[entity] base64_decode()'))
        continue;

    $entity = $k;
    $url2 = $v;
    break;
  }
}


if(!empty($url2)) $json['data'][$entity] = $url2;
send_results();



function send_results() {
  global $json;
  echo json_encode($json);
}

?>