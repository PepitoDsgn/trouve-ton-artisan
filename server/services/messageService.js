const Message = require('../models/mongo/message');

/**
 * Lists contact messages, most recent first.
 * @param {{ lu?: boolean }} [filtre] Optional read / unread filter.
 * @returns {Promise<object[]>} Plain MongoDB documents.
 */
const listerMessages = ({ lu } = {}) => {
  const filtre = lu === undefined ? {} : { lu };
  return Message.find(filtre).sort({ createdAt: -1 }).lean();
};

/**
 * Marks a message as read or unread.
 * @param {string} id MongoDB ObjectId.
 * @param {boolean} lu
 * @returns {Promise<object|null>} The updated message, or null if not found.
 */
const marquerLu = (id, lu) =>
  Message.findByIdAndUpdate(id, { lu }, { returnDocument: 'after' }).lean();

/**
 * Deletes a contact message.
 * @param {string} id MongoDB ObjectId.
 * @returns {Promise<boolean>} false if the message did not exist.
 */
const supprimerMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  return Boolean(message);
};

module.exports = {
  listerMessages,
  marquerLu,
  supprimerMessage,
};
