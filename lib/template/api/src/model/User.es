package api.model;

import server.model.Model;
import server.facade.Cache;

import api.table.User as UserStruct;
import api.model.Address

class User extends Model<User> implements UserStruct {

    list(){
        return this.select().toArray();
    }

    get userName(){
        return 'Zhang shan';
    }

    address(){
        const result = this.hasOne(Address, 'uid');
        return result;
    }

}


