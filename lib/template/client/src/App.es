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
    
    @Override
    render(){
        return <Viewport />
    }

}