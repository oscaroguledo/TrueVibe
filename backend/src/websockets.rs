// src/websockets.rs

use socketioxide::{
    extract::{Data, SocketRef, State},
    SocketIo,
};
use tracing::{info};
use crate::state;
use crate::models::{MessageIn, Messages};
use state::MessageStore;

// Handle new WebSocket connections
pub async fn on_connect(socket: SocketRef) {
    info!("socket connected: {}", socket.id);

    // Handle the "join" event (client joining a room)
    socket.on(
        "join",
        |socket: SocketRef, Data::<String>(room), store: State<MessageStore>| async move {
            info!("Received join: {:?}", room);

            // Leave all rooms and join the specified room
            let _ = socket.leave_all();
            let _ = socket.join(room.clone());

            // Fetch messages for the room and send them to the client
            let messages = store.get(&room).await;
            let _ = socket.emit("messages", Messages { messages });
        },
    );

    // Handle the "message" event (client sending a message)
    socket.on(
        "message",
        |socket: SocketRef, Data::<MessageIn>(data), store: State<MessageStore>| async move {
            info!("Received message: {:?}", data);

            // Create a new message with the current time and user information
            let response = state::Message {
                text: data.text,
                user: format!("anon-{}", socket.id),
                date: chrono::Utc::now(),
            };

            // Store the message in the MessageStore
            store.insert(&data.room, response.clone()).await;

            // Broadcast the message to all clients in the room
            let _ = socket.within(data.room).emit("message", response);
        },
    );
}

// Handler for the "/hello" route
pub async fn handler(axum::extract::State(io): axum::extract::State<SocketIo>) {
    info!("handler called");

    // Emit a simple "hello" event to all connected clients
    let _ = io.emit("hello", "world");
}
