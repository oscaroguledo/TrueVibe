// src/db/chat.rs

use diesel::prelude::*;

use db::index::{DbPool,ConnectionManager,users, messages, chats, connections,User, Message, Chat, Connection};


// Get all chats
pub fn get_chats(pool: &DbPool) -> Result<Vec<Chat>, diesel::result::Error> {
    use crate::schema::chats::dsl::*;
    let connection = pool.get().unwrap();
    chats.load::<Chat>(&connection)
}
