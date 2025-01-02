
#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Message {
    pub message_id: i32,
    pub user_id: i32,
    pub chat_id: i32,
    pub content: String,
    pub message_attachment: String, //, 'image', 'video', etc.
    pub sent_at: DateTime<Utc>,
    pub edited: Boolean,
    pub edited_at: DateTime<Utc>,
}

