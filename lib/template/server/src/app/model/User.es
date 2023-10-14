package app.model;

import server.model.Model;

import table.User as UserStruct;
import app.model.Address 

import server.database.concern.BaseQuery;

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


