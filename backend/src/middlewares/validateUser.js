const validateUser = (req, res, next) => {
  // Extraction des données du corps de la requête
  const {
    name,
    firstname,
    email,
    gender,
    date_of_birth: dateOfBirth,
    postal_code: postalCode,
    city,
    number_vehicles: numberVehiclesString,
    profil_image: profilImage,
    is_admin: isAdmin,
  } = req.body;

  // Expressions régulières pour la validation
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Tableau pour stocker les erreurs de validation
  const errors = [];

  // Validation pour le champ 'name'
  if (name == null) {
    errors.push({ field: "Nom", message: "Ce champ est obligatoire" });
  } else if (name.length >= 100) {
    errors.push({
      field: "Nom",
      message: "Doit contenir moins de 100 caractères",
    });
  }

  // Validation pour le champ 'firstname'
  if (firstname == null) {
    errors.push({ field: "Prénom", message: "Ce champ est obligatoire" });
  } else if (firstname.length >= 100) {
    errors.push({
      field: "Prénom",
      message: "Doit contenir moins de 45 caractères",
    });
  }

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

  // Validation pour le champ 'gender'
  if (gender == null) {
    errors.push({ field: "Sexe", message: "Ce champ est obligatoire" });
  } else if (gender.length >= 45) {
    errors.push({
      field: "Sexe",
      message: "Doit contenir moins de 45 caractères",
    });
  }

  // Validation pour le champ 'date_of_birth'
  if (dateOfBirth == null) {
    errors.push({
      field: "Anniversaire",
      message: "Ce champ est obligatoire",
    });
  } else if (!dateRegex.test(dateOfBirth)) {
    errors.push({
      field: "Anniversaire",
      message: "Format de date invalide. Utilisez le format YYYY-MM-DD",
    });
  }

  // Validation pour le champ 'postal_code'
  if (postalCode == null) {
    errors.push({ field: "postalCode", message: "Ce champ est obligatoire" });
  } else if (!/^[0-9]{5}$/.test(postalCode)) {
    errors.push({
      field: "Code Postal",
      message: "Code postal invalide (doit contenir 5 chiffres)",
    });
  }

  // Validation pour le champ 'city'
  if (city == null) {
    errors.push({ field: "city", message: "Ce champ est obligatoire" });
  } else if (city.length >= 45) {
    errors.push({
      field: "Ville",
      message: "Doit contenir moins de 45 caractères",
    });
  }
  // ...

  // Convertir la valeur du champ 'number_vehicles' en un nombre
  const numberVehicles = parseInt(numberVehiclesString, 10);

  // Validation pour le champ 'number_vehicles'
  if (
    numberVehicles == null ||
    Number.isNaN(numberVehicles) ||
    numberVehicles < 0
  ) {
    errors.push({
      field: "Nonmbre de véhicules",
      message: "Le nombre de véhicules doit être un entier positif",
    });
  }

  // Validation pour le champ 'profil_image'
  if (profilImage) {
    const regex = /\.(jpg|jpeg|png|gif)$/i;

    if (!regex.test(profilImage)) {
      errors.push({
        field: "profilImage",
        message:
          "Format d'image invalide. Les formats autorisés sont JPG, JPEG, PNG et GIF.",
      });
    }
  }

  // Validation pour le champ 'is_admin'
  if (isAdmin == null) {
    errors.push({ field: "isAdmin", message: "Ce champ est obligatoire" });
  } else if (![0, 1].includes(isAdmin)) {
    errors.push({
      field: "isAdmin",
      message: "Le rôle doit être 0 ou 1",
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

module.exports = validateUser;
