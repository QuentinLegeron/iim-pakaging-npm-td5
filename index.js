const csv = require('csv-parser');
const fs = require('fs');

function updateCSV() {
  const results = [];

  fs.createReadStream('students.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (!data.Note) {
        data.Note = getRandomNumber(0, 20).toString();
      }
      results.push(data);
    })
    .on('end', () => {
      const ws = fs.createWriteStream('students.csv');
      const headers = Object.keys(results[0]).join(',');
      ws.write(headers + '\n');
      const averageRowIndex = results.findIndex((row) => row.Prenom === 'Average');
      if (averageRowIndex !== -1) {
        results.splice(averageRowIndex, 1);
      }


      results.forEach((data) => {
        const row = Object.values(data).join(',');
        ws.write(row + '\n');
      });


      const sum = results.reduce((acc, row) => acc + parseInt(row.Note || 0), 0);
      const average = sum / results.length;

      const averageRow = { Student_pk: '', Nom: '', Prenom: 'Average', Note: average };
      const averageRowString = Object.values(averageRow).join(',');
      ws.write(averageRowString + '\n');
      

      ws.end();
    });
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

updateCSV();

module.exports = { updateCSV };
