package;

import web.components.Router;
import web.components.Viewport;
import web.Application;

class App extends Application{

    @main
    static main(){
        when( Env(NODE_ENV, development) ){
            //设置开发模式时与服务端请求的代理前缀
            System.setConfig('http.request.config.baseURL', '/api');
        }
        const obj = new App();
        obj.mount(document.getElementById('app'));
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
        return super.routes;
    }

    @Override
    render(){
        return <Viewport />
    }

}