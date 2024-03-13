const validateTableProperties = (tables, Array) => {
  Array.forEach((property) => {
    expect(tables).toHaveProperty(property);
  });
};
// Fonction pour valider les propriétés d'une réservation
// Fonction pour trouver une réservation dans la liste
const findTable = (table, tableToFind) => {
  return table.find((tableKey) =>
    Object.keys(tableToFind).every((key) => tableKey[key] === tableToFind[key])
  );
};

module.exports = { validateTableProperties, findTable };
