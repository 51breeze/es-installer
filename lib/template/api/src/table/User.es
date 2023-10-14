package api.table;

struct table User{
  id: int(11) auto_increment,
  account: varchar(16),
  password: varchar(32),
  create_at:int(11),
  status:int(6),
  PRIMARY KEY(id)
}