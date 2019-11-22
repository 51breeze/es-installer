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


function match(routes, pathName )
{
    if( !routes )
    {
        return null;
    }

    pathName = pathName.replace(/^\/|\/$/g,'');
    const pathArr = pathName.split('/');
    for(var p in routes )
    {
       const routeName = p.replace(/^\/|\/$/g,'').toLowerCase();
       const routeArr = routeName.split('/');
       if( routeArr.length === pathArr.length )
       {
           var args = [];
           var props = [];
           if( p.indexOf("{") >= 0 )
           {
                var index = 0;
                var len = routeArr.length;
                while( index < len )
                {
                    var name = routeArr[ index ];
                    if( name.charAt(0) ==="{" && name.charAt(name.length-1) ==="}" )
                    {
                       props.push( name.slice(1,-1) )
                       args.push( pathArr[index] );

                    }else if( name !== pathArr[index].toLowerCase() )
                    {
                       break;
                    }
                    index++;
                }

                if( index < len )
                {
                    continue;
                }

           }else if( routeName !== pathName.toLowerCase() )
           {
               continue;
           }

           return {
              provider:routes[ p ],
              props:props,
              args:args
           }
       }
    }
    return null;
}

function start( module , method, callback )
{
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
}

var global = System.getGlobalEvent();
global.addEventListener(Event.READY,function (e) {

    var routeMap = env.HTTP_ROUTES && env.HTTP_ROUTES.get || {};
    var path = Locator.query( env.URL_PATH_NAME );
    if( !path )
    {
        path = Locator.path().join("/") ;
    }else{
        path = path.replace(/^\/|\/$/g,'');
    }

    path = path.toLowerCase();
    var matchRouter = path && match( routeMap, path );
    var router = path ? matchRouter : {
        provider:env.HTTP_DEFAULT_ROUTE,
        props:[],
        args:[]
    };
    var controller = router ? router.provider.split("@") : [];
    var module = controller[0];
    var method = controller[1];
    env.HTTP_ROUTE_CONTROLLER=router;

    if( router )
    {
        if( matchRouter )
        {
            env.HTTP_ROUTE_PATH = path;
        }else
        {
            Object.forEach(routeMap,function (provider, name)
            {
                if( provider === router )
                {
                    env.HTTP_ROUTE_PATH = name;
                    return false;
                }
            });
        }

        (env.HTTP_DISPATCHER=function(classname, method, callback)
        {
            if( lazyLoadMap.hasOwnProperty(classname) )
            {
                lazyLoadMap[ classname ]( function(module){
                    start(module,method,callback);
                });

            }else
            {
                start( Internal.getClassModule(classname) ,method, callback);
            }

        })(module, method);

    }else if( global.dispatchEvent( new Event("ROUTE_NOT_EXISTS") ) )
    {
        document.body.innerHTML = "<p style='text-align: center;margin-top: 50px;font-size: 18px;'>Access page does not exist.</p>";
    }

},false,-500);