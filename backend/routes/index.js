const { handle_404_requests } = require("../controller/errorRouteController");
const statusRoutes = require("./statusRoutes");
const groupRoutes = require('./groupRoutes');
const userRoutes = require('./userRoutes');
const messageRoutes = require("./messageRoutes");
const channelRoutes = require("./channelRoutes");
const videoCallRoutes = require('./routes/call/videoCallRoutes');
const audioCallRoutes = require('./routes/call/audioCallRoutes');

module.exports = (app) => {
  // declaring all the different parent paths to be used in the api
  app.use("/api/v1/status", statusRoutes);
//   app.use("/api/v1/events", eventRoutes);
//   app.use("/api/v1/screenshots", screenshotRoutes);
//   app.use("/api/v1/eyetrackingdata", eyetrackingdataRoutes);
//   app.use("/api/v1/eyetrackingposition", eyetrackingpositionRoutes);
    app.use("/api/v1/channel", channelRoutes);
    app.use("/api/v1/message", messageRoutes);
    // Use the group routes
    app.use('/api/v1/groups', groupRoutes);
    app.use('/api/v1/users', userRoutes);
    // Use video call routes
    app.use('/api', videoCallRoutes);
    app.use('/api', audioCallRoutes);
//   app.use("/api/v1/youtubeupload", youtubeUploadRoutes);
//   app.use("/api/v1/dashboard", dashboardRoutes);
  // handle unknown routes
  app.use(handle_404_requests);
};