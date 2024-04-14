package;

import web.components.Router;
import web.components.Viewport;
import web.components.Component;
import web.components.Link;
import web.Application;
import pages.Home;

class App extends Application{

    @main
    static main(){

        when( Env(NODE_ENV, development) ){
            System.setConfig('http.request.config.baseURL', '/api');
        }

        const obj = new App();
        const app = document.createElement('div')
        document.body.append( app );
        obj.mount(app);
    }

    constructor(){
        super();
    }

    private _router:Router=null;

    @Override
    get router(){
        if(_router)return _router;
        return _router = new Router({
            mode:'hash',
            routes:this.routes
        });
    }

    @Override
    get routes(){
        //获取自动生成的路由
        super.routes;

        //自定义路由
        return [
            {
                path:"/home",
                name:'Home',
                meta:{title:"Home"},
                component:Home
            },
            {
                path:"/list",
                name:'List',
                meta:{title:"List"},
                component(){
                    return import( './pages/List.es' );
                }
            }
        ]
    }

    title:string = 'Hello world!';

    @Override
    render(){
        const styles={
            padding:"0 1rem"
        }
        return <div xmlns:d="@directives" style="text-align:center;" >
            <h1 class="title">{title}</h1>
            <div class="menus" style="border-bottom:solid 1px #ccc;padding:10px">
                <d:each name={this.router.getRoutes()} item="route" key="index">
                    <Link to={route.path} ref='menu' key={index} style={styles}>{route.name}</Link>
                </d:each>
            </div>
            <br />
            <Viewport />
        </div>
    }

}