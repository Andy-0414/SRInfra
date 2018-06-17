const express = require('express');
const app = express(); // 서버 모듈
const fs = require('fs'); // 파일 입출력
const Graph = require('node-dijkstra'); // 최단거리
const klunch = require('k-lunch'); // 급식
const bodyParser = require('body-parser'); // POST
var mysql = require('mysql');
var con = mysql.createConnection({
    host: '58.145.101.15',
    user: 'root',
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
        // 최단거리 데이터 필요
    })
})
app.post('/user/signin', (req, res) => { // 로그인
    var id = req.body.id; // 유저 아이디
    var pw = req.body.pw; // 유저 패스워드
    var sql = "SELECT id,password FROM login WHERE id=?"
    con.query(sql, [id], (err, result, fields) => {
        if (err) {
            res.status(505).end(); // 에러 시 505
        }
        if (!result[0]) {
            console.log("login id x");
            res.status(405).end(); // 아이디가 없을 시 405
        }
        else {
            if (result[0].password == pw) {
                console.log(`[LOGIN USER]\nID : ${id}`);
                res.status(200).end(); // 성공 시 200
            }
            else {
                console.log("login pw x");
                res.status(405).end(); // 비밀번호 불일치 시 405
            }
        }

    })
})
app.post('/user/signup', (req, res) => { // 회원가입
    var name = req.body.name; // 유저 이름
    var id = req.body.id; // 유저 아이디
    var pw = req.body.pw; // 유저 패스워드
    if (!name || !id || !pw) {
        console.log("[NOT DATA]")
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        var sql = "SELECT id FROM login WHERE id=?";
        con.query(sql, [id], (err, result, fields) => {
            if (err) {
                res.status(505).end(); // 에러 시 505
            }
            if (!result[0]) {
                var sql = "INSERT INTO login (id, password, name) VALUES(?,?,?)";
                con.query(sql, [id, pw, name], (err, result, fields) => {
                    if (err) {
                        res.status(505).end(); // 에러 시 505
                    }
                    else {
                        var date = new Date();
                        console.log(`[Create User]\nID : ${id}\nNAME : ${name}`);
                        res.status(200).end() // 제대로 생성됬을 시 200
                    }
                })
            }
            else {
                console.log("[SAME USER]")
                res.status(405).end(); // 이미 있는 사용자일시 405
            }
        });
    }
})

app.post('/find', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    if (!name || !id) {
        console.log("[NOT DATA]")
        res.status(405).end() // 데이터가 없을 시 405
    }
    else {
        var sql = "SELECT id,name FROM login WHERE id=?";
        con.query(sql, [id], (err, result, fields) => {
            if (err) {
                res.status(505).end(); // 에러 시 505
            }
            if (!result[0]) {
                console.log("[NOT DATA]")
                res.status(405).end() // 데이터가 없을 시 405
            }
            else {
                if (result[0].name == name) {
                    console.log("[FIND DATA]")
                    res.status(200).end() // 찾았을 시 200
                }
            }
        });
    }

})
app.post('/change', (req, res) => {
    var id = req.body.id;
    var pw = req.body.password;

    var sql = "UPDATE login SET password=? WHERE id=?"
    con.query(sql, [pw, id], (err, result, fields) => {
        if (err) {
            res.status(505).end(); // 에러 시 505
        }
        else{
            console.log("[CHANGE DATA]")
            res.status(200).end();
        }
    })
})
app.listen(3030, () => {
    console.log('Server Open');
})