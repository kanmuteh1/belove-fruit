const http = require("http");
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const db_file = "fruitSelection";
const db = new sqlite3.Database(db_file);

function createTable(){
    db.run('CREATE TABLE IF NOT EXISTS fruits(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, fruit_name VARCHAR(20));', (err, result) => {
        if(!err){
            console.log('fruits table created')
        }
        else{
            console.log(err)
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" VARCHAR(20), fruit_id int NOT NULL)`, (err, result) => {
        if(!err){
            console.log('users table created')
        }
        else{
            console.log(err)
        }
        // https://github.com/Kwagei/p2-week6-assignment-kanmuteh1.git
    });

    // db.all('SELECT * FROM students WHERE name = "John Doe"', (err, data) => {
    //     console.log("Data", data);
    // })
}
createTable();

function insertFruits(){
    let fruits_obj = {
        1: "Apple",
        2: "Watermelon",
        3: "Orange",
        4: "Strawberry",
        5: "Grape",
        6: "Mango",
        7: "Plum",
        8: "Banana",
        9: "Papaya",
        10: "Pineapple",
        11: "Lime",
        12: "Lemon",
        13: "Grapefruit",
        14: "Coconut",
        15: "Avocado"
    }

    Object.values(fruits_obj).forEach(ele => {
        db.run(`INSERT INTO fruits(fruit_name) VALUES(?);`, ele, (err, result) => {
            console.log(err, result)
        });
    })
}

const server = http.createServer((req, res) => {
    let url = req.url;
    let method = req.method;

    if (url === "/" && method === "GET"){
        fs.readFile("./users.html", "utf8", (err, data) => {
            res.end(data);
        })
    } else if (url === "/user/create" && method === "GET"){
        fs.readFile("./create-user.html", "utf8", (err, data) => {
            res.end(data);
        })
    } else if (url === "/fruits" && method === "GET"){
        // TODO 1
        db.all('SELECT * FROM fruits', (err, data) => {
            res.end(JSON.stringify({status: 0, data: data}));
        })
        /**
         * Query the fruits table, get the data and send it to the frontend 
         */
    } else if (url === "/user/create" && method === "POST"){
        // TODO 2
        let front_end_data = '';
        req.on('data', (data)=>{
            front_end_data += data;
        })
        req.on('end', ()=>{
            let fullData = JSON.parse(front_end_data);
            let name = fullData.name;
            let fruit = fullData.fruitname;
            db.run(`INSERT INTO users(name, fruit_id) VALUES(?,?);`,[name,fruit],(err, result) => {
                if(!err){
                    console.log('data inserted')
                }
                else{
                    console.log(err)
                }
            });
        })
        /**
         * Get the data from the front-end and store it in the users table
         */
    } else if (url === "/users" && method === "GET"){
        // TODO 3
        db.all(`SELECT * FROM users INNER JOIN fruits ON fruits.id = users.fruit_id;`, (err, data) => {
            if(!err){
                if(!err){
                    res.end(JSON.stringify({status: 'ok', msg: 'data obtain', data: data}))
                }
                else{
                    res.end(JSON.stringify({status: 'fail', msg: 'data not obtain'}))
                }
            }
            else{
                console.log(err)
            }
        })
        /**
         * Query the users table, get the data and send it to the frontend 
         */
    } else {
        res.end("404");
    }

    // db.close();
})

server.listen(3200, () => {
    console.log("Server is listening on port 3200");
})