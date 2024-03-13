const validateUserLogin = (req, res, next) => {
  // Extraction des données du corps de la requête
  const { email, password } = req.body;

  // Expressions régulières pour la validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  // Tableau pour stocker les erreurs de validation
  const errors = [];

  // Validation pour le champ 'email'
  if (email == null) {
    errors.push({ field: "email", message: "Ce champ est obligatoire" });
  } else if (email.length >= 100) {
    errors.push({
      field: "email",
      message: "Doit contenir moins de 100 caractères",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Email invalide" });
  }

  // Validation pour le champ 'password'
  if (password == null) {
    errors.push({ field: "password", message: "Ce champ est obligatoire" });
  }
  if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Le mot de passe doit contenir au moins 8 caractères",
    });
  }
  // Si des erreurs sont présentes, retourne une réponse avec le code de statut 422
  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    // Si aucune erreur, passe à la fonction middleware suivante
    next();
  }
  return null;
};

module.exports = validateUserLogin;
