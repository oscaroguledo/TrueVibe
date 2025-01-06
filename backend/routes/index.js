const { handle_404_requests } = require("../controller/errorRouteController");
const statusRoutes = require("./statusRoutes");
const groupRoutes = require('./groupRoutes');
const userRoutes = require('./userRoutes');
const messageRoutes = require("./messageRoutes");
const channelRoutes = require("./channelRoutes");
const videoCallRoutes = require('./call/videoCallRoutes');
const audioCallRoutes = require('./call/audioCallRoutes');
const taskRoutes = require('./taskRoutes');
const fileShareRoutes = require('./fileShareRoutes');
const notificationRoutes = require('./notificationRoutes');
const integrationRoutes = require('./integrationRoutes');
const userSettingsRoutes = require('./userSettingsRoutes');
const calendarRoutes = require('./event/calenderRoutes');
const chatRoutes = require('./chatRoutes');

module.exports = (app) => {
    // declaring all the different parent paths to be used in the api
    app.use("/api/v1/status", statusRoutes);
    app.use("/api/v1/events/calendar-events", calendarRoutes);
    app.use("/api/v1/settings", userSettingsRoutes);
    app.use("/api/v1/integrations", integrationRoutes);
    app.use("/api/v1/notifications", notificationRoutes);
    app.use("/api/v1/channels", channelRoutes);
    app.use("/api/v1/chats", chatRoutes);
    app.use("/api/v1/messages", messageRoutes);
    // Use the group routes
    app.use('/api/v1/groups', groupRoutes);
    app.use('/api/v1/users', userRoutes);
    // Use video call routes
    app.use('/api/v1/video-calls', videoCallRoutes);
    app.use('/api/v1/audio-calls', audioCallRoutes);
    app.use("/api/v1/tasks", taskRoutes);
    app.use("/api/v1/files", fileShareRoutes);
    // handle unknown routes
    app.use(handle_404_requests);
};