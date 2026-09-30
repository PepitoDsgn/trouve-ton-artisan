const { mongoose } = require('../../config/mongo');

// Message de contact envoyé à un artisan. Stocké en NoSQL : c'est un document
// autonome, écrit une fois puis lu par l'admin, sans jointure nécessaire.
// Le nom de l'artisan est recopié pour que le message reste lisible même si
// l'artisan est supprimé de la base SQL.
const messageSchema = new mongoose.Schema(
  {
    artisan: {
      id: { type: Number, required: true, index: true },
      nom: { type: String, required: true },
    },
    utilisateurId: { type: Number, required: true },
    nom: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, maxlength: 254 },
    objet: { type: String, trim: true, maxlength: 150 },
    message: { type: String, required: true, maxlength: 2000 },
    lu: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
