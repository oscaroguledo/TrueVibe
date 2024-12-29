// src/room.rs

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Chat {
    pub chat_id: i32,
    pub chat_type: String, // 'private' or 'group'
    pub chat_name: Option<String>, // Only for group chats
    pub created_by: i32, // User ID of the creator
    pub created_at: DateTime<Utc>,
}