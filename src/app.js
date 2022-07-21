const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const storePath = path.join(__dirname,'./store.json')
const bodyParser = require('body-parser')
const fs = require('fs')
// body parser config
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
const fileRead = () => {
    let todos = JSON.parse(fs.readFileSync(storePath))
    return todos
}
const writeFile = (data) => {
    fs.writeFileSync(storePath, JSON.stringify(data), 'utf8')
}
//Create todo
app.post("/todo", (req, res)=>{
    const data = fileRead()
    console.log(req)
    data.todos.push({id: Math.floor(Math.random()*10),...req.body.data})
    writeFile(data)
    res.json("Todo's successfully created..")
})
// findall Todo
app.get("/todos", (req, res)=>{
    const data = fileRead()
    res.json({
        message: "your todo's",
        data: data.todos 
    })
})
//update APi
app.put("/todo/:id", (req, res)=>{
    const {todos} = fileRead()
    const updatedData = todos.map((data)=>{
        if(req.params.id == data.id){
            return {id: data.id,...req.body.data}
        }
        return data
    })
    console.log(updatedData)
    writeFile({todos: updatedData})
    res.json({
        message: "your data updated successfully",
        data: {
            ...req.body.data
        }
    })
})
app.delete("/todo/:id", (req, res)=>{
    const {todos} = fileRead()
    const deletedData = todos.filter(data => {
        return req.params.id != data.id
    })
    writeFile({todos: deletedData})
    res.json({
        message: "your data deleted successfully"
    })
})

app.listen(port, ()=>{
    console.log(`app listening on port ${port}`)
})