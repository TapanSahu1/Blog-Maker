import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import * as fs from 'node:fs';
import {unlink} from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port= 3000;
const app= express();
const dirc= "/public/blogs";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(port, () => {
  console.log(`Server live at ${port}.`)
});

app.get("/",(req,res) => {

  const dirc= "/public/blogs/";
  fs.readdir(__dirname+dirc, (err, files) => {

    if(err){
      console.log("Error in reading directory");
    }
    var fileNames= files;
    var filesLength= files.length;

    for(let i=0;i<filesLength;i++){
      var route="/"+fileNames[i];

      app.get(route,(req,res)=>{
        res.render(__dirname+dirc+fileNames[i]);
      });
    }

    res.render("index.ejs",{
    Titles : fileNames,
    Length : filesLength
    });
  });
});

// Create

app.get("/create",(req,res)=>{

  res.render("create.ejs");

});

app.post("/create",(req,res) =>{

  var fileName=req.body["title"]+".ejs";
  const dirc= "/public/blogs";
  const fullFilePath= __dirname+dirc+"/"+fileName;
  const title="<h2>"+req.body["title"]+"</h2><br>";
  const rawBody=("<h5>"+req.body["content"]+"</h5>").toString();
  const body= rawBody.replaceAll("\n", "<br>");
  const header= "<%-include('../../views/partials/header')%>";
  const footer= "<%-include('../../views/partials/footer')%>";
  const content=header+title+body+footer;

  fs.writeFile(fullFilePath,content,(err) => {
    if(err) throw err;
    console.log("The file has been saved!");
  });

  res.redirect("/create");

});

// Delete
app.get("/delete", (req,res)=>{

  fs.readdir(__dirname+dirc, (err, files) => {

      if(err){
        console.log("Error in reading directory");
      }
      var fileNames= files;
      var filesLength= files.length;

      res.render("delete.ejs",{
        Titles : fileNames,
        Length : filesLength
      });
  });
});

app.post("/delete",async (req,res)=>{

  var fileName=req.body["title"]+".ejs";
  const dirc= "/public/blogs";
  const fullFilePath= __dirname+dirc+"/"+fileName;
  await unlink(fullFilePath, (err) => {
    if (err){
      console.log("File does not exist");
    }
    
    console.log('File was deleted');
  });

    fs.readdir(__dirname+dirc, (err, files) => {

      if(err){
        console.log("Error in reading directory");
      }
      var fileNames= files;
      var filesLength= files.length;

      res.render("delete.ejs",{
        Titles : fileNames,
        Length : filesLength
      });
    });

});


  