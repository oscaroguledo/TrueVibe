// src/models.rs
use crate::state;
use serde::{Serialize, Deserialize};

// Define the structure of an incoming message (from the client)
#[derive(Debug, Deserialize)]
pub struct MessageIn {
    pub id: String,
    pub user: String,
    pub room: String,
    pub text: String,
    pub subroom: String,
    pub date: String,
}

// Define the structure of outgoing messages (to be sent to clients)
#[derive(Serialize, Debug)]
pub struct Messages {
    pub messages: Vec<state::Message>, // Assuming `state::Message` is defined in `state.rs`
}