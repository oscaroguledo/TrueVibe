// src/models.rs
use crate::state;
use serde::{Serialize, Deserialize};

// Define the structure of an incoming message (from the client)
#[derive(Debug, Deserialize)]
pub struct MessageIn {
    pub room: String,
    pub text: String,
}

// Define the structure of the outgoing messages (to be sent to clients)
#[derive(Serialize)]
pub struct Messages {
    pub messages: Vec<state::Message>, // Assuming `state::Message` is the struct defined in `state.rs`
}
