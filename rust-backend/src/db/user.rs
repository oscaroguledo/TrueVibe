// src/db.rs

use diesel::prelude::*;
use crate::models::{User, Message, Chat, Connection};
use crate::schema::{users, messages, chats, connections};
use diesel::r2d2::{self, ConnectionManager};

use db::index::{DbPool,ConnectionManager,users, messages, chats, connections,User, Message, Chat, Connection};

// Get all users
pub fn get_users(pool: &DbPool) -> Result<Vec<User>, diesel::result::Error> {
    use crate::schema::users::dsl::*;
    let connection = pool.get().unwrap();
    users.load::<User>(&connection)
}
