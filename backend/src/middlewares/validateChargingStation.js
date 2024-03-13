const validateChargingStation = (req, res, next) => {
  // Extraction des données du corps de la requête
  const {
    adresse_station: adresseStation,
    coordonneesXY,
    nbre_pdc: nbrePdc,
    puissance_nominale: puissanceNominale,
    prise_type_ef: priseTypeEf,
    prise_type_2: priseType2,
    prise_type_combo_ccs: priseTypeComboCcs,
    prise_type_chademo: priseTypeChademo,
    prise_type_autre: priseTypeAutre,
  } = req.body;

  // Tableau pour stocker les erreurs de validation
  const errors = [];
  // Fonction utilitaire pour vérifier si une valeur est un nombre valide
  const isValidNumber = (value) => {
    return (
      typeof value === "number" &&
      !Number.isNaN(value) &&
      Number.isFinite(value)
    );
  };

  // Validation pour le champ 'adresseStation'
  if (!adresseStation || typeof adresseStation !== "string") {
    errors.push({
      field: "adresseStation",
      message:
        "Le champ 'adresseStation' est obligatoire et doit être une chaîne de caractères.",
    });
  }

  // Validation pour le champ 'coordonneesXY'
  if (
    !coordonneesXY ||
    !Array.isArray(coordonneesXY) ||
    coordonneesXY.length !== 2 ||
    !isValidNumber(coordonneesXY[0]) ||
    !isValidNumber(coordonneesXY[1])
  ) {
    errors.push({
      field: "coordonneesXY",
      message:
        "Le champ 'coordonneesXY' est obligatoire et doit être un tableau de deux nombres [longitude, latitude].",
    });
  }

  // Validation pour le champ 'nbrePdc'
  if (!isValidNumber(nbrePdc)) {
    errors.push({
      field: "nbrePdc",
      message:
        "Le champ 'nbrePdc' est obligatoire et doit être un nombre valide.",
    });
  }

  // Validation pour le champ 'puissanceNominale'
  if (!isValidNumber(puissanceNominale)) {
    errors.push({
      field: "puissanceNominale",
      message:
        "Le champ 'puissanceNominale' est obligatoire et doit être un nombre valide.",
    });
  }

  // Validation pour les champs 'priseTypeEf', 'priseType2', 'priseTypeComboCcs', 'priseTypeChademo', 'priseTypeAutre'
  const validPriseValues = ["TRUE", "FALSE"];
  if (!validPriseValues.includes(priseTypeEf)) {
    errors.push({
      field: "priseTypeEf",
      message:
        "Le champ 'priseTypeEf' est obligatoire et doit avoir la valeur 'TRUE' ou 'FALSE'.",
    });
  }

  if (!validPriseValues.includes(priseType2)) {
    errors.push({
      field: "priseType2",
      message:
        "Le champ 'priseType2' est obligatoire et doit avoir la valeur 'TRUE' ou 'FALSE'.",
    });
  }

  if (!validPriseValues.includes(priseTypeComboCcs)) {
    errors.push({
      field: "priseTypeComboCcs",
      message:
        "Le champ 'priseTypeComboCcs' est obligatoire et doit avoir la valeur 'TRUE' ou 'FALSE'.",
    });
  }

  if (!validPriseValues.includes(priseTypeChademo)) {
    errors.push({
      field: "priseTypeChademo",
      message:
        "Le champ 'priseTypeChademo' est obligatoire et doit avoir la valeur 'TRUE' ou 'FALSE'.",
    });
  }

  if (!validPriseValues.includes(priseTypeAutre)) {
    errors.push({
      field: "priseTypeAutre",
      message:
        "Le champ 'priseTypeAutre' est obligatoire et doit avoir la valeur 'TRUE' ou 'FALSE'.",
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

module.exports = validateChargingStation;
