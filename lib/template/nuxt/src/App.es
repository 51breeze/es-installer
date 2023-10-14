import web.Application
import web.components.Viewport;
import web.ui.Layout

class App extends Application{

    @Main
    static main(){
       
        if( !System.hasRegisterHook('httpRequestCreated') ){

            when( Env(platform, 'server') ){
                System.setConfig('http.request.baseURL', 'http://127.0.0.1:8000');
            }then{
                System.setConfig('http.request.baseURL', '/api');
            }

            System.registerHook('httpRequestCreated', (request)=>{
                request.interceptors.response.use((res)=>{
                    if( res && res.status === 200 ){
                        return res.data;
                    }else{
                        return {};
                    }
                })
            });
        }
    }

    @Override
    render(h){
        return <Layout name="default">
            <Viewport />
        </Layout>
    }
}