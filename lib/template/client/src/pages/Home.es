package pages;

import web.components.Component
import web.Lang;
import stores.UserStore;


class Home extends Component{

      @Provider
      list:{label:string}[] = [];

      @Reactive
      private fromData = {account:'account',password:'password',check:'checked',type:'email'}

      @reactive
      private _title:string='Home page';

      @Provider('homePage')
      provides(){
            return [1];
      }

      set title(value:string){
            this._title = value;
      }

      get title(){
            return this._title;
      }

      addItem(item:{label:string}){
            this.list.push( item );
      }

      setType(value){
            this.fromData.type = value;
      }

      @Override
      onMounted(){
            //使用store;
           const userStore = UserStore.use();
           console.log(`获取用户登录信息:  ${userStore.fetch()}`)

            //获取Home.es 里配置的start
            const start = Lang.fetch('home.start')
            console.log(`获取Home.es 里配置的start语言:  ${start}`)

            //获取common.env 里配置的host.  优先级最低只有在其它配置文件中没有定义时才会返回这里的值
            const host = Lang.fetch('host')
            console.log(`获取common.env 里配置的host:  ${host}`)
      }     

      @Override
      render(){

            return <div data-title="home" xmlns:local="components" xmlns:d="@directives" xmlns:s="@slots">
                  <h5 ref='title'>{title}</h5>
                  <local:List ref='list' items={this.list} title ={this.title} fromData={this.fromData}  ></local:List>
                  <local:Slot ref="slot-component-1" items = {list}>
                        <div>footer default children</div>
                  </local:Slot>
                  <local:Slot ref="slot-component-2" items = {list}>
                        <s:head>
                             <h3>Slot component: definition</h3>
                        </s:head>
                        <s:content scope="items">
                              <div d:for="(item,index) in items" ref='slot-item'>definition: {item.label}</div>
                        </s:content>
                  </local:Slot>
                  <local:Directive></local:Directive>
               
            </div>
      }

}