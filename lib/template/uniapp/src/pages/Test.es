package pages;
import mp.components.Component;
import pages.Person;
import net.Http;
import net.HttpCancelToken;

class Test extends Component{

    onClick(e){
        console.log( e, '-----------')
    }

    @Override
    onReady():void{

        //console.log(  HttpCancelToken.source() )

       
         const {token:cancelToken, cancel} =  HttpCancelToken.source();
        
          const request = Http.create({cancelToken});
         request.get('https://www.miniscloud.com/members-api/logout').then( res=>{
            console.log( res )
         }).catch( e=>{
            console.log( e , '----------', Http.isCancel(e) )
         })

         cancelToken.promise.then( res=>{
             console.log( res , '-------- cancelToken.promise.then----------')
         })

        cancel('ssss');
         

    }

    @Override
    protected onMounted():void{
        
         console.log('-----onMounted-------------', this )
    }

    @Injector
    private esApp;

    @Provider
    get name(){
        return 'zhangshan'
    }

    @Override
    protected render():VNode|Component{

       return <div xmlns:ui="mp.ui" on:click={onClick}>
            <ui:Card title="sssss">sdfdsfdsf</ui:Card>

           <ui:Grid>
                <ui:GridItem>
                    <text>文本1</text>
                </ui:GridItem>
                <ui:GridItem>
                    <text>文本2</text>
                </ui:GridItem>
                <ui:GridItem>
                    <text>文本3</text>
                </ui:GridItem>
           </ui:Grid>

           <ui:CoverView>
                <ui:View hoverClass="ssss">this is View</ui:View>
           </ui:CoverView>

       

            <Person />


       </div>
    }

}