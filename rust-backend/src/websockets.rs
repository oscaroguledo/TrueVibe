// src/websockets.rs

use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use tracing::{info};
use tracing::error;
use crate::state;
use crate::models::{MessageIn, Messages};

// Handle new WebSocket connections
pub async fn on_connect(socket: SocketRef) {
    info!("socket connected: {}", socket.id);

    // Handle the "join" event (client joining a room)
    socket.on(
        "join",
        // |socket: SocketRef, Data::<String>(room), store: State<MessageStore>| async move {
        |socket: SocketRef, Data::<String>(room)| async move {
            info!("Received join: {:?}", room);

            // Leave all rooms and join the specified room
            // let _ = socket.leave_all();
            let _ = socket.join(room.clone());

            // Fetch messages for the room and send them to the client
            // let messages = store.get(&room).await;
            // let _ = socket.emit("messages", Messages { messages });


            // Format the message
            let message = format!("just joined: {:?}", room);
            
            // Emit the message to the client
            let _ = socket.emit("join-message", message);
        },
    );

    // Handle the "message" event (client sending a message)
    socket.on(
        "message",
        |socket: SocketRef, Data::<MessageIn>(data)| async move {
            // Log the received message for debugging
            info!("Received message: {:?}", data);

            // Create a new message with the current time and user information
            let response = state::Message {
                id: data.id.clone(),
                sender: format!("anon-{}", socket.id), // Assign a sender ID based on the socket
                user: data.user.clone(),
                room: data.room.clone(),
                text: data.text.clone(),
                subroom: data.subroom.clone(),
                date: data.date,
            };
            

            // Broadcast the message to all clients in the room except the sender
            // let room = data.room.clone();
            // Emit the message to the client
            let _ = socket.emit("message", response.clone());
            // if let Err(e) = socket
            //     .to(room)                  // Target the room
            //     .emit("message", response.clone()) // Emit the message
            // {
            //     error!("Failed to broadcast message: {:?}", e);
            // }
        }
    );

}

// Handler for the "/hello" route
pub async fn handler(axum::extract::State(io): axum::extract::State<SocketIo>) {
    info!("handler called");

    // Emit a simple "hello" event to all connected clients
    let _ = io.emit("hello", "world");
}
