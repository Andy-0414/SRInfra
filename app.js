const express = require('express');
const app = express(); // 서버 모듈
const fs = require('fs'); // 파일 입출력
const Graph = require('node-dijkstra'); // 최단거리
const klunch = require('k-lunch'); // 급식
const bodyParser = require('body-parser'); // POST
var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'http://58.145.101.15:3000:3306',
    user: 'srinfra',
    password: '1111',
    database: 'SRinfra'
});

con.connect();
const options = {
    autoCode: true,
    autoDomain: true
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

app.get('/distance', (req, res) => {
    fs.readFile('data/mapData.json', (err, data) => { // data/ 에있는 mapData.json파일을 불러옴
        const route = new Graph(JSON.parse(data));
        // 최단거리 짜야함
    })
})
app.get('/test', (req, res) => {
    var sql = "INSERT INTO login (id, password) VALUES('testId', 'testPassword')";
    con.query(sql, (err, result, fields)=>{
        console.log('good');
    })
})
app.post('/login', (req, res) => {

})
app.listen(3030, () => {
    console.log('Server Open');
})