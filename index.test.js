const fs = require('fs');
const { updateCSV } = require('./index');

test('CSV file is updated correctly', () => {
  // backup des fichiers csv
  fs.copyFileSync('students.csv', 'backup.csv');

  updateCSV();

  // Check CSV s'il a bien été update

  const updatedContent = fs.readFileSync('students.csv', 'utf8');
  const rows = updatedContent.trim().split('\n');

  // Check Si la colonne "Note" a bien été ajoutée à chaque ligne
  for (let i = 1; i < rows.length; i++) {
    const rowData = rows[i].split(',');
    const noteValue = rowData[3];
    expect(noteValue).toBeTruthy(); // check si la valeur de "Note" existe
    expect(parseInt(noteValue)).toBeGreaterThanOrEqual(0); // Check si la valeur de la note est bien entre 0 et 20
    expect(parseInt(noteValue)).toBeLessThanOrEqual(20);
  }

  // Check si la ligne "Average" a bien été ajoutée à la fin du fichier
  const lastRow = rows[rows.length - 1].split(',');
  expect(lastRow[2]).toBe('Average');
  expect(parseFloat(lastRow[3])).toBeDefined(); // Check s'il y a bien une valeur pour la note de la ligne "Average"

  // Remettre les fichiers csv d'origine grace au backup
  fs.copyFileSync('backup.csv', 'students.csv');
  fs.unlinkSync('backup.csv');
});
