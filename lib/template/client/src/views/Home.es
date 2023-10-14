package views;

import web.components.Component

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