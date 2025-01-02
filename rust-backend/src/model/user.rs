// src/models.rs

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    pub user_id: String,
    pub username: String,
    pub email: String,
    pub password: String,
    pub profile_pic: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}
