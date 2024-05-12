// dataSources.js

const xml2js = require('xml2js');
const fs = require('fs');
// const csv = require('csv-parse'); // CSV parser
// const csv = require('csv-parse/lib/sync'); // CSV parser
const { EOL } = require('os'); // for platform-specific line endings

class DataSource {
  readData() {
    throw new Error("readData() must be implemented by subclass");
  }

  writeData(data) {
    throw new Error("writeData() must be implemented by subclass");
  }

  updateData(identifier, newData) {
    throw new Error("updateData() must be implemented by subclass");
  }
}

class CSVDataSource extends DataSource {
  constructor(filepath) {
    super();
    this.filepath = filepath;
  }

  readData() {
    const fileContent = fs.readFileSync(this.filepath, 'utf8');
    return csv.parse(fileContent);
  }

  writeData(data) {
    const csvContent = data.map(row => row.join(',')).join(EOL);
    fs.writeFileSync(this.filepath, csvContent, 'utf8');
  }

  updateData(identifier, newData) {
    const data = this.readData();
    data.forEach(row => {
      if (row[0] === identifier) {
        row.splice(1, row.length - 1, ...newData);
      }
    });
    this.writeData(data);
  }
}

class TSVDataSource extends DataSource {
  constructor(filepath) {
    super();
    this.filepath = filepath;
  }

  readData(filename) {
    return new Promise((resolve, reject) => {
      let data = [];
    //   fs.createReadStream(this.filename)
      fs.createReadStream(this.filepath+filename)
        .pipe(csv({ separator: '\t' }))
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', reject);
    });
  }

  writeData(data) {
    const tsvContent = data.map(row => row.join('\t')).join(EOL);
    fs.writeFileSync(this.filepath, tsvContent, 'utf8');
  }

  updateData(identifier, newData) {
    const data = this.readData();
    data.forEach(row => {
      if (row[0] === identifier) {
        row.splice(1, row.length - 1, ...newData);
      }
    });
    this.writeData(data);
  }
}

class XMLDataSource extends DataSource {
  constructor(filepath) {
    super();
    this.filepath = filepath;
  }

  readData() {
    const xml = fs.readFileSync(this.filepath, 'utf8');
    let result;
    xml2js.parseString(xml, (err, parsed) => {
      if (err) throw err;
      result = parsed;
    });
    return result;
  }

  writeData(data) {
    const builder = new xml2js.Builder();
    const xml = builder.buildObject(data);
    fs.writeFileSync(this.filepath, xml, 'utf8');
  }

  updateData(identifier, newData) {
    const data = this.readData();
    const elements = data.root.element;

    elements.forEach(element => {
      if (element.$.id === identifier) {
        Object.assign(element, newData);
      }
    });

    this.writeData(data);
  }
}

module.exports = {
  CSVDataSource,
  TSVDataSource,
  XMLDataSource,
};
