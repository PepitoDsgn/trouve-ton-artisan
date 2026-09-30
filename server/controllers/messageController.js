const messageService = require('../services/messageService');

const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.listerMessages({ lu: req.query.lu });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const message = await messageService.marquerLu(req.params.id, req.body.lu);

    if (!message) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const supprime = await messageService.supprimerMessage(req.params.id);

    if (!supprime) {
      return res.status(404).json({ message: 'Message introuvable' });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  updateMessage,
  deleteMessage,
};
