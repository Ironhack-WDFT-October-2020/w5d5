const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { uploader, cloudinary } = require('../config/cloudinary');

/* GET home page */
router.get('/', (req, res, next) => {
  Movie.find()
    .then(movies => {
      res.render('index', { movies });
    })
    .catch(err => {
      next(err);
    })
});

router.get('/movie/add', (req, res, next) => {
  res.render('movie-add');
})

router.post('/movie/add', uploader.single('photo'), (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  const { title, description } = req.body;
  const imgPath = req.file.path;
  const imgName = req.file.originalname;
  const publicId = req.file.filename;
  Movie.create({ title, description, imgPath, imgName, publicId })
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      next(err);
    })
  // create the Movie
});

router.get('/movie/delete/:id', (req, res, next) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(movie => {
      if (movie.imgPath) {
        cloudinary.uploader.destroy(movie.publicId);
      }
      res.redirect('/');
    })
    .catch(err => {
      next(err);
    })
});


module.exports = router;
