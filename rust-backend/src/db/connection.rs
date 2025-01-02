// src/db/connection.rs

use diesel::prelude::*;

use db::index::{DbPool,ConnectionManager,users, messages, chats, connections,User, Message, Chat, Connection};


// Add a new connection
pub fn add_connection(pool: &DbPool, new_connection: &Connection) -> Result<Connection, diesel::result::Error> {
    use crate::schema::connections::dsl::*;
    let connection = pool.get().unwrap();
    diesel::insert_into(connections)
        .values(new_connection)
        .get_result::<Connection>(&connection)
}
