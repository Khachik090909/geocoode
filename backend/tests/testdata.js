const argon2 = require("argon2");

const charginStationKeys = [
  "nom_operateur",
  "telephone_operateur",
  "nom_enseigne",
  "implantation_station",
  "adresse_station",
  "coordonneesXY",
  "nbre_pdc",
  "puissance_nominale",
  "prise_type_ef",
  "prise_type_2",
  "prise_type_combo_ccs",
  "prise_type_chademo",
  "prise_type_autre",
  "tarification",
  "condition_acces",
  "reservation",
  "horaires",
  "accessibilite_pmr",
  "restriction_gabarit",
  "consolidated_longitude",
  "consolidated_latitude",
];

const chargingStationToCreate = {
  nom_operateur: "ELECTRIC 55 CHARGING",
  telephone_operateur: "33975891501",
  nom_enseigne: "ELECTRIC 55 CHARGING",
  implantation_station: "Voirie",
  adresse_station: "1 Avenue Victor Basch 84300 Cavaillon",
  coordonneesXY: [5.042062, 43.836565],
  nbre_pdc: 1,
  puissance_nominale: 22,
  prise_type_ef: "TRUE",
  prise_type_2: "TRUE",
  prise_type_combo_ccs: "FALSE",
  prise_type_chademo: "FALSE",
  prise_type_autre: "FALSE",
  tarification: "",
  condition_acces: "AccÃ¨s rÃ©servÃ©",
  reservation: "TRUE",
  horaires: "24/7",
  accessibilite_pmr: "Accessible mais non rÃ©servÃ© PMR",
  restriction_gabarit: "15mÂ²",
  consolidated_longitude: 5.042062,
  consolidated_latitude: 43.836565,
};
const chargingStationUpdateData = {
  nom_operateur: "ELECTRIC 55 CHARGING",
  telephone_operateur: "33975891501",
  nom_enseigne: "ELECTRIC 55 CHARGING",
  implantation_station: "Voirie",
  adresse_station: "1 Avenue Victor Basch 84300 Cavaillon",
  coordonneesXY: [5.042062, 43.836565],
  nbre_pdc: 1,
  puissance_nominale: 22,
  prise_type_ef: "FALSE",
  prise_type_2: "FALSE",
  prise_type_combo_ccs: "FALSE",
  prise_type_chademo: "FALSE",
  prise_type_autre: "FALSE",
  tarification: "",
  condition_acces: "AccÃ¨s rÃ©servÃ©",
  reservation: "TRUE",
  horaires: "24/7",
  accessibilite_pmr: "Accessible mais non rÃ©servÃ© PMR",
  restriction_gabarit: "15mÂ²",
  consolidated_longitude: 5.042062,
  consolidated_latitude: 43.836565,
};
// *****************************************************************************

const carCreate = {
  car_image: "immage-test-create",
  user_id: 1,
  brand_id: 1,
  plug_id: 1,
};
const carUpdate = {
  car_image: "immage-test-update",
  user_id: 2,
  brand_id: 2,
  plug_id: 2,
};
const carKeys = ["id", "car_image", "user_id", "brand_id", "plug_id"];
// *****************************************************************************

const reservationCreate = {
  user_id: 1,
  charging_station_id: 1,
  reservation_date: "2023-12-20",
  amount_paid: "5.70",
};
const reservationUpdate = {
  user_id: 2,
  charging_station_id: 2,
  reservation_date: "2024-01-20",
  amount_paid: "6.64",
};
const reservationKeys = [
  "id",
  "user_id",
  "charging_station_id",
  "reservation_date",
  "amount_paid",
];
// *****************************************************************************
const userCreate = {
  name: "Sahakyan",
  firstname: "Khachik",
  email: "khachiksahakyan@gmail.com",
  gender: "home",
  date_of_birth: "1990-09-09",
  postal_code: "31100",
  city: "toulouse",
  number_vehicles: 3,
  profil_image: "coucou.jpeg",
  is_admin: 1,
};

const createUserWithHashedPassword = async () => {
  const hash = await argon2.hash("1234567890");
  return { ...userCreate, hashed_password: hash };
};

const userUpdate = {
  name: "Sahakyan",
  firstname: "Khachik",
  email: "khachiksahakyan@gmail.com",
  gender: "home",
  date_of_birth: "1990-09-09",
  postal_code: "31100",
  city: "toulouse",
  number_vehicles: 3,
  profil_image: "coucou.jpeg",
  is_admin: 1,
};
const updateUserWithHashedPassword = async () => {
  const hash = await argon2.hash("1234567890");
  return { ...userUpdate, hashed_password: hash };
};

module.exports = {
  charginStationKeys,
  chargingStationToCreate,
  chargingStationUpdateData,

  carCreate,
  carUpdate,
  carKeys,

  reservationCreate,
  reservationUpdate,
  reservationKeys,

  createUserWithHashedPassword,
  updateUserWithHashedPassword,
  userUpdate,
  userCreate,
};
