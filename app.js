const express = require('express');
const app = express();
const fs = require('fs');
const Graph = require('node-dijkstra')
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
        time: req.params.lunch,
        name: '선린인터넷고등학교',
        phase: 4
    }
    klunch.getLunch(form, (err, output) => {
        if (err) { // 없는 데이터일시
            res.send(null);
        }
        else { // 데이터가 있을시
            res.send(output)
        }

    }, options)

});

app.get('/time/:grade/:class', (req, res) => { // 시간표 가져오기
    var g = req.params.grade;
    var c = req.params.class;
    fs.readFile('data/timeTable/' + g + 'g.json', (err, data) => { // data/timeTable/ 에있는 json파일을 불러옴
        if (err) res.send(null);
        else {
            res.send({
                result: JSON.parse(data)[c] // json파일로 변환후 해당 반에 대한 시간표 전송
            });
        }
    })

})

app.get('/distance',(req,res)=>{
    fs.readFile('data/mapData.json', (err, data) => { // data/ 에있는 mapData.json파일을 불러옴
        const route = new Graph(JSON.parse(data));
        // 최단거리 짜야함
    })
})

app.listen(3030, () => {
    console.log('Server Open');
})