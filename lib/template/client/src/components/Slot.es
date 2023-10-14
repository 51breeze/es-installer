package components;
import web.components.Component;
class Slot extends Component {

    items:({label:string})[] = [];

    title:string ='default';
    
    @Override
    render(){
        return <div class="slot" xmlns:ui="web.ui" xmlns:d="@directives" xmlns:s="@slots">
            <div class='head'>
                <s:head>
                    <h3>Slot component: {this.title}</h3>
                </s:head>
            </div>
            <div class='content'>
                <p>Content: </p>
                <s:content items={items}>
                    <div d:for="(item,index) in items" ref='item'>default: {item.label}</div>
                </s:content>
            </div>
            <div class='footer'><s:default /></div>
        </div>
    }

}