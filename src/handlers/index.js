const invitationHandler = require('./invitation');

// Add new notification types here as you grow
const handlers = {
  USER_INVITATION: invitationHandler,
};

module.exports = async (payload) => {
  const handler = handlers[payload.type];

  if (handler) {
    return await handler(payload);
  } else {
    console.warn(`⚠️ No handler found for type: ${payload.type}`);
  }
};
