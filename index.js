const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const { error } = require('console');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    return res.send('namaste');
});
app.get('/api/users', (req, res) => {
    return res.json(users);
});
// app.get('/api/users/:id',(req,res)=>{
//     const id=Number(req.params.id);
//     const user=users.find((user)=>user.id===id);
//     return res.json({user});
// });
app.post('/api/users/', (req, res) => {
    users.push({ ...req.body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error, data) => {
        return res.send(`${users.length} id user added`);
    })

});
// app.delete('/api/users/:id',(req,res)=>{
//     const id=Number(req.params.id);
//     const removed =users.splice(id-1,1);
//     fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),()=>{

//         return res.json(removed);
//     });
// })

app.route('/api/users/:id').get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json({ user });
}).delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index == -1) return res.json({ "status": "User is not present" });

    const removed = users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {

        return res.json(removed);
    });
}).patch((req,res)=>{
    const id=Number(req.params.id);
    const body =req.body;
    const idx =users.findIndex((user)=>user.id===id);
    if(idx==-1)return res.send('user is not present');
    users.at(idx).email=body.email;
    users.at(idx).first_name=body.first_name;
    users.at(idx).last_name=body.last_name;
    users.at(idx).gender=body.gender;
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        return res.send(`user${id}updated succesfully`)
    });

})

app.listen(8000, () => { console.log("Server started") });