//以下代码仅供参考
//将以下代码复制到 laravel -> index.php
//如果要接入其它 php 框架请自行修改

require_once __DIR__.'/../server/bootstrap/index.php';
$es = new EaseScript( $app );
$router = $app->make( Illuminate\Routing\Router::class );
$es->bindRoute(function($method,$pathName, $callback)use(&$router,&$app)
{
    $router->$method( $pathName, function(...$args)use(&$app,&$callback)
    {
        $request = $app->make( Illuminate\Http\Request::class);
        $response = $app->make( Illuminate\Http\Response::class);
        return $callback($request, $response, $args);

    });
});

$database = function($cmd,$params,$callback)
{
    $result = DB::select( DB::raw($cmd) );
    $result = array_map(function($item){
        return new \es\system\BaseObject( $item );
    },$result);
    $callback( new \es\system\ArrayList( $result ) );
};

$redis = function($cmd,$params,$callback)
{
   //todo...
};

$es->pipe("database",$database);
$es->pipe("redis",  $redis );
