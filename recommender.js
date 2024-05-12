const fs = require('fs');
const csv = require('csv-parser');
const csvrw = require('csv');
const _ = require('lodash');
// const TSVDataSource = require('./dataSources');

function processData(source) {
  const data = source.readData();
  console.log("Data:", data);

  source.updateData('some_id', ['new_value1', 'new_value2']);
}

// might need something like this:
// https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents#active_learning_a_dynamic_shopping_list

// const tsvSource = new TSVDataSource('data.tsv');

// processData(tsvSource);

// update the tsv file with the new data
// add song to the played list
function markPlayed(year, index) {
    // Define the path to the TSV file
    const tsvPath = `import/billboard/${year}.tsv`;

    // Read the TSV file
    const tsvData = fs.readFileSync(tsvPath, 'utf-8');

    // Parse the TSV data
    csvrw.parse(tsvData, { delimiter: '\t', columns: true }, (err, records) => {
        if (err) {
            console.error(err);
            return;
        }

        // Find the song and update the "Played" field
        for (let record of records) {
            if (record[""] === index) {
                record['Played'] = 1;
                break;
            }
        }

        // Stringify the updated data
        csvrw.stringify(records, { header: true, delimiter: '\t' }, (err, output) => {
            if (err) {
                console.error(err);
                return;
            }

            // Write the updated data back to the TSV file
            fs.writeFileSync(tsvPath, output);
        });
    });
}

function never_play(year, index) {
    // Define the path to the TSV file
    const tsvPath = `import/billboard/${year}.tsv`;

    // Read the TSV file
    const tsvData = fs.readFileSync(tsvPath, 'utf-8');

    console.log(`song id: ${index}`)
    // Parse the TSV data
    csvrw.parse(tsvData, { delimiter: '\t', columns: true }, (err, records) => {
        if (err) {
            console.error(err);
            return;
        }

        // Find the song and update the "Played" field
        for (let record of records) {
            console.log(`record[""]: ${record[""]}`)
            if (record[""] === index) {
                record['Played'] = -1;
                break;
            }
        }

        // Stringify the updated data
        csvrw.stringify(records, { header: true, delimiter: '\t' }, (err, output) => {
            if (err) {
                console.error(err);
                return;
            }

            // Write the updated data back to the TSV file
            fs.writeFileSync(tsvPath, output);
        });
    });
}



function get_songs(year, num_songs) {
    return new Promise((resolve, reject) => {
        let songs = [];
        fs.createReadStream(`import/billboard/${year}.tsv`)
            .pipe(csv({ separator: '\t' }))
            .on('data', (data) => {
                data.Year = year
                songs.push(data)
            })
            .on('end', () => {
                let unplayed_songs = songs.filter(song => song.Played == 0);
                let selected_songs = _.sampleSize(unplayed_songs, num_songs);
                resolve(selected_songs);
            })
            .on('error', reject);
    });
}
async function replace_song(year) {
    let song = await get_songs(year, 1);
    console.log(`new song: ${song[0]}\n${song}`)
    return song[0];
}

async function create_round() {
    let songs_80s = await get_songs(_.random(1980, 1989), 2);
    let songs_90s = await get_songs(_.random(1990, 1999), 2);
    let songs_00s = await get_songs(_.random(2000, 2009), 2);
    let songs_60s_70s = await get_songs(_.random(1960, 1979), 2);
    let songs_10s = await get_songs(_.random(2010, 2023), 2);

    let round = songs_80s.concat(songs_90s, songs_00s, songs_60s_70s, songs_10s);
    return round;
}

// create_round().then(data => console.dir(data, {depth: null})).catch(console.error);
create_round().then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);

module.exports = {
    get_songs,
    create_round,
    never_play
};