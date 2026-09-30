if (!process.env.JWT_SECRET) {
  throw new Error('La variable JWT_SECRET est obligatoire');
}

const DUREE_SESSION_SECONDES = 2 * 60 * 60;

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  dureeSessionSecondes: DUREE_SESSION_SECONDES,
  cookieNom: 'token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DUREE_SESSION_SECONDES * 1000,
  },
};
