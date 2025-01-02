const { kafkaClient } = require("../config/kafka.config");

const adminInit = async (topics) => {
  const admin = kafkaClient.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin Connected Successfully...");

  console.log(`Creating Topic [${topics}]`);
  // Ensure topics is an array
  if (!Array.isArray(topics)) {
    throw new TypeError('topics must be an array');
  }
  const topicConfigurations = topics.map(topic => ({
    topic: topic,
    numPartitions: 2,
    replicationFactor: 1
  }));
  await admin.createTopics({
    topics: topicConfigurations,
  });
  console.log(`Topic ${topics} Created Successfully `);

  console.log("Disconnecting Admin..");
  await admin.disconnect();
  console.log("Admin Disconnected Successfully...");
}
module.exports = adminInit;