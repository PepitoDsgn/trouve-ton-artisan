const Message = require('../models/mongo/message');

// Les plus récents d'abord ; filtre facultatif sur le statut lu / non lu
const listerMessages = ({ lu } = {}) => {
  const filtre = lu === undefined ? {} : { lu };
  return Message.find(filtre).sort({ createdAt: -1 }).lean();
};

// Retourne null si le message n'existe pas
const marquerLu = (id, lu) =>
  Message.findByIdAndUpdate(id, { lu }, { returnDocument: 'after' }).lean();

// Retourne false si le message n'existe pas
const supprimerMessage = async (id) => {
  const message = await Message.findByIdAndDelete(id);
  return Boolean(message);
};

module.exports = {
  listerMessages,
  marquerLu,
  supprimerMessage,
};
