// src/db/messages.rs

use diesel::prelude::*;

use db::index::{DbPool,ConnectionManager,users, messages, chats, connections,User, Message, Chat, Connection};


// Get messages for a specific chat
pub fn get_messages_for_chat(pool: &DbPool, chat_id: i32) -> Result<Vec<Message>, diesel::result::Error> {
    use crate::schema::messages::dsl::*;
    let connection = pool.get().unwrap();
    messages.filter(chat_id.eq(chat_id))
        .load::<Message>(&connection)
}

// Add a new message
pub fn add_message(pool: &DbPool, new_message: &Message) -> Result<Message, diesel::result::Error> {
    use crate::schema::messages::dsl::*;
    let connection = pool.get().unwrap();
    diesel::insert_into(messages)
        .values(new_message)
        .get_result::<Message>(&connection)
}
