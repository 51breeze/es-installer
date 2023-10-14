package pages.members;

import web.components.Page;

@Router('/members/profile', id?=1, name?='name' )
class Profile extends Page{
    @Override
    protected render(){
        return <div>/members/profile</div>
    }

}