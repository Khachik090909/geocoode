const validateMessage = (req, res, next) => {
  // Extraction des données du corps de la requête
  const { name, email, object, subject } = req.body;

  // Expressions régulières pour la validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  // Tableau pour stocker les erreurs de validation
  const errors = [];

  // Validation pour le champ 'name'
  if (name == null) {
    errors.push({ field: "name", message: "Ce champ est obligatoire" });
  } else if (name.length >= 100) {
    errors.push({
      field: "name",
      message: "Doit contenir moins de 100 caractères",
    });
  }

  // Validation pour le champ 'email'
  if (email == null) {
    errors.push({ field: "email", message: "Ce champ est obligatoire" });
  } else if (email.length >= 100) {
    errors.push({
      field: "email",
      message: "Doit contenir moins de 255 caractères",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Email invalide" });
  }

  // Validation pour le champ 'object'
  if (object == null) {
    errors.push({ field: "object", message: "Ce champ est obligatoire" });
  } else if (object.length >= 255) {
    errors.push({
      field: "object",
      message: "Doit contenir moins de 255 caractères",
    });
  }

  // Validation pour le champ 'subject'
  if (subject == null) {
    errors.push({ field: "subject", message: "Ce champ est obligatoire" });
  } else if (subject.length < 10) {
    errors.push({
      field: "subject",
      message: "Doit contenir au moins de 10 caractères",
    });
  }

  // Si des erreurs sont présentes, retourne une réponse avec le code de statut 422
  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    // Si aucune erreur, passe à la fonction middleware suivante
    next();
  }
};

module.exports = validateMessage;
