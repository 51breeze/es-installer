import Internal from "@system/Internal.js" ;
import Object from "@system/Object.js" ;
import Locator from "@system/Locator.js" ;
import Event from '@system/Event.js';
import System from '@system/System.js';
var lazyLoadMap = [CODE[LAZY_LOAD_MAP]];
var env=Object.merge(Internal.env,{
    "HTTP_DEFAULT_ROUTE":"[CODE[HTTP_DEFAULT_ROUTE]]",
    "HTTP_ROUTES":[CODE[HTTP_ROUTES]],
    "HTTP_ROUTE_PATH":null,
    "MODE":[CODE[MODE]],
    "ORIGIN_SYNTAX":"[CODE[ORIGIN_SYNTAX]]",
    "URL_PATH_NAME":"[CODE[URL_PATH_NAME]]",
    "HTTP_ROUTE_CONTROLLER":null,
    "COMMAND_SWITCH":[CODE[COMMAND_SWITCH]],
    "WORKSPACE":"[CODE[WORKSPACE]]",
    "MODULE_SUFFIX":"[CODE[MODULE_SUFFIX]]",
    "HOT_UPDATA":[CODE[HOT_UPDATA]]
});

var global = System.getGlobalEvent();
global.addEventListener(Event.READY,function (e) {

    var routeMap = env.HTTP_ROUTES && env.HTTP_ROUTES.get || {};
    var path = Locator.query( env.URL_PATH_NAME );
    if( !path )
    {
        path = '/'+Locator.path().join("/");
    }

    path = path.toLowerCase();
    var router = routeMap[ path ] || env.HTTP_DEFAULT_ROUTE;
    var controller = router ? router.split("@") : [];
    var module = controller[0];
    var method = controller[1];
    env.HTTP_ROUTE_CONTROLLER=router;

    if( typeof routeMap[ path ] !== "undefined")
    {
        env.HTTP_ROUTE_PATH = path ;
    }else
    {
        Object.forEach(routeMap,function (provider, name)
        {
            if( provider === router ){
            env.HTTP_ROUTE_PATH = name;
            return false;
            }
        });
    }

    (env.HTTP_DISPATCHER=function(classname, method, callback)
    {
        lazyLoadMap[ classname ](function( module ){
            if( typeof callback === "function" )
            {
                callback( module );

            }else
            {
                var obj = new module();
                obj.dispatchEvent( new Event(Event.INITIALIZING) );
                if( method )
                {
                    if( typeof obj[method] === "function" )
                    {
                        obj[method]();
                    }else{
                        throw new ReferenceError( method+" is not exist.");
                    }
                }
                if( obj.hasEventListener(Event.INITIALIZE_COMPLETED) )
                {
                    obj.dispatchEvent(new Event(Event.INITIALIZE_COMPLETED));
                }
            }
        });
    })(module, method);

},false,-500);