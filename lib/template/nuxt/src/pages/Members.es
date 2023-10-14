package pages;

import web.components.Page;
import web.components.Viewport

@Router('members')
@Redirect(pages.members.Index)

class Members extends Page{

    @Override
    protected render(){
        
        return <div>
            <div>members</div>
            <Viewport />
        </div>
    }

}