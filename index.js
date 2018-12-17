const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const uuidv1 = require('uuid/v1');
const fs = require('fs');

const fileUpload = require('express-fileupload');
const Tesseract = require('tesseract.js');

app.use(express.static(__dirname + '/public'));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname + '/public/views/main.html'));
});

// default options
app.use(fileUpload());

app.post('/upload', function (req, res) {
    if (!Object.keys(req.files).length)
        return res.status(400).send('No files were uploaded.');

    let file = req.files.file;

    const filepath = __dirname + '/images/' + uuidv1() + ' .jpg';
    file.mv(filepath).then(
        Tesseract.recognize(filepath, {
            lang: 'rus'
        }).progress(message => console.log(message))
            .catch(err => res.send('Something went wrong'))
            .then(result => {
                //fs.unlinkSync(filepath);
                res.send(result.text);
            })
    );
});

app.listen(3000);