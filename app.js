const express = require('express');
const app = express();
const fs = require('fs');

const klunch = require('k-lunch')
const options = {
    autoCode: true,
    autoDomain: true
}

app.use(express.static("data"));

app.get('/meal/:year/:m/:day/:lunch', (req, res) => { // 급식 가져오기 /meal/년도/월/일/중식or석식
    const form = {
        year: req.params.year,
        month: req.params.m,
        day: req.params.day,
        time: req.params.lunch, // Breakfast = 1, Lunch = 2, Dinner = 3
        name: '선린인터넷고등학교',
        phase: 4
    }
    klunch.getLunch(form, (err, output) => {
        if (err) {
            res.send(null);
        }
        else {
            res.send(output)
        }

    }, options)

});

app.get('/time/:grade/:class', (req, res) => {
    var g = req.params.grade;
    var c = req.params.class;
    fs.readFile('data/timeTable/' + g + 'g.json', (err, data) => {
        if (err) res.send(null);
        else {
            res.send({
                result: JSON.parse(data)[c]
            });
        }
    })

})


app.listen(3030, () => {
    console.log('Server Open');
})