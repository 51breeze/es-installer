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
    "HOT_UPDATA":[CODE[HOT_UPDATA]],
    "HTTP_DISPATCHER":function(classname, method, args)
    {
        if( lazyLoadMap.hasOwnProperty(classname) )
        {
            lazyLoadMap[ classname ]( function(module){
                start(module,method,args);
            });

        }else
        {
            start( Internal.getClassModule(classname) ,method, args);
        }
    }
});

function getModuleIdByClassname( classname )
{
    return './'+ env.WORKSPACE+'/'+classname.replace(/\./g,'/');
}

Internal.require=function( classname, callback )
{
    var mid = getModuleIdByClassname(classname);
    var installedModules =  __webpack_require__.c;
    if( installedModules.hasOwnProperty( mid ) )
    {
        return __webpack_require__( mid );
    }
    __webpack_require__.e( mid ).then(function(){
        if( callback ){
           callback(module.default || module);
        }
    });
}

Internal.require.has = function( classname )
{
    var mid = getModuleIdByClassname(classname);
    var installedModules =  __webpack_require__.c;
    return installedModules.hasOwnProperty( mid );
}

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
                       var rule = name.slice(1,-1);
                       if( rule.charAt(0) ===":" )
                       {
                            var regexp = rule.slice(1);
                            var flags = "";
                            var index = regexp.lastIndexOf("/");
                            if( index > 0 )
                            {
                                flags  = regexp.slice( index+1 );
                                regexp = regexp.slice(0, index);
                            }

                            var mathed = pathArr[index].match( new RegExp( regexp, flags) );
                            if( mathed )
                            {
                                props.push( name );
                                args.push( mathed[1] || pathArr[index] );

                            }else
                            {
                                break;
                            }

                       }else
                       {
                            props.push( rule );
                            args.push( pathArr[index] );
                       }

                    }else if( name !== pathArr[ index ].toLowerCase() )
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

function start( module , method, args )
{
    if( typeof method === "function" )
    {
        method( module , args);
        return;

    }else
    {
        var obj = new module();
        obj.dispatchEvent( new Event(Event.INITIALIZING) );
        if( method )
        {
            if( typeof obj[method] === "function" )
            {
                obj[method].apply(obj,args);
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

    var requestMethod = window["HTTP_REQUEST_METHOD"] || "get";
    var routeMap = (env.HTTP_ROUTES && env.HTTP_ROUTES[ requestMethod.toLowerCase() ]) || {};
    var path = Locator.query( env.URL_PATH_NAME );
    if( !path )
    {
        path = Locator.path().join("/");
    }

    var router = match( routeMap, path );
    if( !router && env.HTTP_DEFAULT_ROUTE )
    {
        router ={
            provider:env.HTTP_DEFAULT_ROUTE,
            props:[],
            args:[]
        }
    }

    if( router )
    {
        var controller = router.provider.split("@");
        var module = controller[0];
        var method = controller[1];
        env.HTTP_ROUTE=router.provider;
        env.HTTP_PATH = path;
        env.HTTP_PARAMS = router.args;
        env.HTTP_DISPATCHER(module, method, router.args);

    }else if( global.dispatchEvent( new Event("ROUTE_NOT_EXISTS") ) )
    {
        document.body.innerHTML = "<p style='text-align: center;margin-top: 50px;font-size: 18px;'>Access page does not exist.</p>";
    }

},false,-500);