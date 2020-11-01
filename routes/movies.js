const movie=require('../models/movie');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const rentPerDay=50;
const axios = require('axios');
const auth=require('../middleware/auth');

router.get('/',auth,async(req,res)=>{
    try{
       
       let pageNo = req.query.pageNo;
       let limit = 50;
       let skipMovies = (pageNo-1)*limit;

      let movies = await movie.find().skip(skipMovies).limit(limit);
      res.status(200).json({
        movies
    });

        // let getmovies=await Imdbmovies.find({title:"CITY OF GOD"});
        // fetchMovieByID("City of gold");
        // async function fetchMovieByID(id) {
        //     const newUrl = 'http://www.omdbapi.com/?apikey=d0b74394&i=' + id;
        //     const response = await axios.get(newUrl);
        //     res.send(response.data); 
        }
        
    
    catch(e){
        res.status(404).json({
            e
        })
    }
    
});

router.post('/getByName',async(req,res)=>{
    let movieName=req.body.movieName;
    movieName=movieName.toUpperCase();
    let getMovie=await movie.find({title:`${movieName}`});
    if(getMovie.length==0)
    {
        const url = 'http://www.omdbapi.com/?apikey=d0b74394&s=' + movieName;
        let response = await axios.get(url);
        response=response.data.Search[0].imdbID;
        let result=await fetchMovieByID(response);
        let newMovieInfo={
            ID:result.imdbID,
            title:result.Title.toUpperCase(),
            year:result.Year,
            genre:result.Genre,
            duration:result.Runtime,
            country:result.Country,
            language:result.Language,
            director:result.Director,
            writer:result.Writer,
            productionCompany:result.Production,
            actors:result.Actors,
            description:result.Plot,
            imdb:result.imdbRating+"/10",
            totalVotes:result.imdbVotes,
            rentPerDay:rentPerDay

        }
        let newMovie= new movie(newMovieInfo);
        await newMovie.save();
        res.send(result);


        async function fetchMovieByID(id) {
                const newUrl = 'http://www.omdbapi.com/?apikey=d0b74394&i=' + id;
                const response = await axios.get(newUrl);
                return response.data;
                
      }
    }
   
    res.status(200).json({
        getMovie
    });

});




router.get('/getByIMDB',async(req,res)=>{

    var data;
    let search=req.body.name;
    const url = 'http://www.omdbapi.com/?apikey=d0b74394&s=' + search;
    const imdbID = [];
    let movieInfo = [];
    axios.get(url)
        .then(response => {
            // In Axios responses are already served as javascript object, no need to parse, simply get response and access data.
            // The response.data is in JSON so we dont need to parse it or do response.json like working with Fetch API (Coding Train Promises Tuturial - https://www.youtube.com/watch?v=QO4NXhWo_NM&list=PLRqwX-V7Uu6bKLPQvPRNNE65kBL62mVfx)
            data = response.data;
            if(data["Response"] == "True") {
                for(let i = 0; i < data["Search"].length; i++) {
                    imdbID.push(data["Search"][i]["imdbID"]);
                }
            }
            // Else next then() gets imdbID[] as empty array and hence no 'newUrl' requests are made and movieInfo[] remains empty
        })
        .then(() => {
            // Make an array of promises so that we get data in the same order as requested in the first place<from search 1 to last search>
            let promises = [];
            imdbID.forEach(function(id) {
                promises.push(fetchMovieByID(id));
                
            });
            
            // When all the promises are fulfilled
            Promise.all(promises)
                .then(results => {
                    // We can send this movieInfo (array of objects<particular movie detials> to the reuslts.ejs file
                    movieInfo = results;
                })
                .catch(err => console.error(err))
                .then(() => {
                    // Runs after everything and renders the results page
                    res.send(movieInfo);
                }); 
        async function fetchMovieByID(id) {
            const newUrl = 'http://www.omdbapi.com/?apikey=d0b74394&i=' + id;
            const response = await axios.get(newUrl);
            return response.data;
        }


}).catch((error) => res.send(error));
});


router.get('/:id',async(req,res)=>{
    
});


router.post('/',async(req,res)=>{
    try{
        let movie = new movie({ 
            title: req.body.title,
            year: req.body.year,
            genre:req.body.genre,
            duration:req.body.duration,
            country:req.body.country,
            language:req.body.language,
            director:req.body.director,
            writer:req.body.writer,
            productionCompany:req.body.productionCompany,
            actors:req.body.actors,
            description:req.body.description,
            imdb:req.body.imdb,
            totlaVotes:req.body.totlaVotes,
            rentPerday:req.body.rentPerday
          });
          let result = await movie.save();
          res.status(200).json({
            result
        });
    }
    
    catch(e){
        res.status(404).json({
            e
        })
    }
    
});

module.exports = router; 