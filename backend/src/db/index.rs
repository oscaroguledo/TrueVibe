// src/db/index.rs

use diesel::prelude::*;
use crate::models::{User, Message, Chat, Connection};
use crate::schema::{users, messages, chats, connections};
use diesel::r2d2::{self, ConnectionManager};

pub type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

pub fn establish_connection() -> DbPool {
    let manager = ConnectionManager::<PgConnection>::new("postgres://username:password@localhost/mydb");
    r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}
