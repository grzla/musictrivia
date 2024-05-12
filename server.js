const express = require('express');
const app = express();
const port = 3000;
// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
const { getSong, createRound, neverPlay, markPlayed } = require('./recommender');

app.get('/round', async (req, res) => {
    try {
        let data = await createRound();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating round.');
    }
});

app.get('/song', async (req, res) => {
    try {
        console.log(`song route request body: ${req.body}`)
        let year = req.body.year
        let data = await get_songs(year, 1);
        res.json(data);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while getting song.');
    }
})

app.post('/neverplay', async (req, res) => {
    try {
        // let songId = req.body.songId;
        // console.log(`req.body: ${req.body}`)
        let year = req.body.year;
        let songId = req.body.id;
        neverPlay(year, songId);
        console.log('hello from neverplay')
        console.log(`${req.body.year}.tsv ${req.body.id} should be -1`)
        // console.log(`req.body: ${req.body.year} ${req.body.song[""]}`)
        console.log(req)   
        // let songIndex = req.body[0]
        // console.log(`req.body[0]: ${req.body[0]}`)

        // Code to update the 'Play status' field in the TSV file to -1 for the song with the specified ID

        // Code to select a new song from the available songs
        let newSong /* = code to select a new song */

        // res.json({ message: 'Song updated successfully', newSong: newSong });
        res.json({ message: 'Song updated successfully', req: req.body });
        // res.json({ message: 'Song updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while updating song.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});