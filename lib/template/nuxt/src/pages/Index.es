package;
import web.components.Page;

@Router('/')
class Index extends Page{
    
    @Reactive
    private data:{name:string} = {name:'Hello,Worlds'}

    @Override
    protected onMounted():void{

    }

    @Override
    async onInitialized(){

        //请求接口
    //    const {data, error, refresh} = await this.useAsyncData(@Router(api.http.Account, index));
    //    if(data.value && data.value.data ){
    //         this.data4 = data.value.data;
    //    }
      
    }

    @Override
    protected render(){
        return <div xmlns:local="components" xmlns:d="@directives" xmlns:s="@slots" xmlns:ui="web.ui" class="login-container">
            <ui:Meta content="es-nuxt"></ui:Meta>
            <ui:Title>es-nuxt</ui:Title>
            <h6>{this.data.name}</h6>
            <ui:Button><ui:Icon name="Plus" />button</ui:Button>
            <ui:Link to="/">Index</ui:Link>
            <ui:Link to={@Router(pages.members.Profile)}>profile</ui:Link>
        </div>
    }

}
