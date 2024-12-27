use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Connection {
    pub user_id: i32,
    pub connected_user_id: i32,
    pub connection_type: String, // 'friend', 'colleague', etc.
    pub created_at: DateTime<Utc>,
}