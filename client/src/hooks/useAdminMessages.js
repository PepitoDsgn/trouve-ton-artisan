import { useCallback, useEffect, useState } from 'react';
import {
  adminGetMessages,
  adminMarquerMessage,
  adminSupprimerMessage,
  messageErreur,
} from '../services/api';

/**
 * Admin contact messages with read / unread toggle and deletion.
 * @param {'tous'|'non-lus'} filtre
 * @returns {{ messages: object[], loading: boolean, notification: object|null,
 *   basculerLu: Function, supprimer: Function, fermerNotification: Function }}
 */
function useAdminMessages(filtre) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    adminGetMessages(filtre === 'non-lus' ? { lu: false } : {})
      .then((data) => {
        if (!ignore) setMessages(data);
      })
      .catch((error) => {
        if (!ignore) setNotification({ type: 'error', message: messageErreur(error) });
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [filtre]);

  const basculerLu = async (message) => {
    try {
      const modifie = await adminMarquerMessage(message._id, !message.lu);
      setMessages((liste) =>
        filtre === 'non-lus' && modifie.lu
          ? liste.filter((element) => element._id !== modifie._id)
          : liste.map((element) => (element._id === modifie._id ? modifie : element))
      );
    } catch (error) {
      setNotification({ type: 'error', message: messageErreur(error) });
    }
  };

  const supprimer = async (message) => {
    try {
      await adminSupprimerMessage(message._id);
      setMessages((liste) => liste.filter((element) => element._id !== message._id));
      setNotification({ type: 'success', message: 'Message supprimé.' });
    } catch (error) {
      setNotification({ type: 'error', message: messageErreur(error) });
    }
  };

  const fermerNotification = useCallback(() => setNotification(null), []);

  return { messages, loading, notification, basculerLu, supprimer, fermerNotification };
}

export default useAdminMessages;
