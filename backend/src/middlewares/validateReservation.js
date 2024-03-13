const validateReservation = (req, res, next) => {
  // Extraction des données du corps de la requête
  const {
    user_id: userId,
    charging_station_id: chargingStationId,
    reservation_date: reservationDate,
    amount_paid: amountPaid,
  } = req.body;

  // Expression régulière pour la validation de la date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Tableau pour stocker les erreurs de validation
  const errors = [];

  // Validation pour le champ 'user_id'
  if (userId === null) {
    errors.push({ field: "userId", message: "Ce champ est obligatoire" });
  }

  // Validation pour le champ 'charging_station_id'
  if (chargingStationId == null) {
    errors.push({
      field: "chargingStationId",
      message: "Ce champ est obligatoire",
    });
  }

  // Validation pour le champ 'reservation_date'
  if (reservationDate == null || reservationDate.trim() === "") {
    errors.push({
      field: "reservationDate",
      message: "Ce champ est obligatoire",
    });
  } else if (!dateRegex.test(reservationDate)) {
    errors.push({
      field: "reservationDate",
      message: "Format de date invalide. Utilisez le format YYYY-MM-DD",
    });
  }

  // Validation pour le champ 'amount_paid'
  if (amountPaid == null || amountPaid.trim() === "") {
    errors.push({ field: "amountPaid", message: "Ce champ est obligatoire" });
  } else if (Number.isNaN(amountPaid)) {
    errors.push({
      field: "amountPaid",
      message: "Le montant payé doit être un nombre",
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

module.exports = validateReservation;
