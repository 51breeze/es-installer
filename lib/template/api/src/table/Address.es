package api.table;

struct table Address{
  id: int(11) auto_increment,
  uid:int(11),
  district: varchar(255),
  province: varchar(255),
  city: varchar(255),
  detail: varchar(255),
  phone: varchar(16),
  postcode?: int(6) DEFAULT 0,
  PRIMARY KEY(id),
  KEY uid(uid)
}