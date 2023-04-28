const express = require('express')
const bodyParser = require('body-parser')
const app = express();
require('dotenv').config()
const mongoose = require('mongoose')
const {urlModel} = require('./schema/urlshort')

const dburl = process.env.MONGO_URL

mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));



app.use(express.static('public'));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}))



app.get('/', async (req, res) => {
    try {
      const allUrl = await urlModel.find();
      res.render('home', {
        urlRes: allUrl
      });
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
  });
  


app.post('/create', async(req,res)=> {

    let shortUrl = URLgenerate();

    let existingUrl = await urlModel.findOne({ shortUrl: shortUrl });

    while (existingUrl) {

        shortUrl = URLgenerate();
        existingUrl = await urlModel.findOne({ shortUrl: shortUrl });

    }


    let urlshort = new urlModel({
        longUrl: req.body.longUrl,
        shortUrl: shortUrl,
    })

    try {
        let data = await urlshort.save();
        console.log(data);
        res.redirect('/')
      } catch (err) {
        console.log(err);
      }

    console.log(req.body.longUrl);
})


app.get('/:urlID', async(req, res) => {
    try {
        const urlshort = await urlModel.findOne({shortUrl: req.params.urlID});
        if (urlshort) {
            await urlModel.findByIdAndUpdate(
                urlshort._id,
                {$inc: {click: 1}}
            );
            res.redirect(urlshort.longUrl);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/del/:id', async (req, res) => {
    try {
        const deldata = await urlModel.findByIdAndDelete({ _id: req.params.id });
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});




app.listen(3000, () => {
    console.log("Server Listening to 3000");
})



function URLgenerate() {
    var ranRes = "";
    var Char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    var CharLen = Char.length;

    for(var i=0; i < 5; i++){
        ranRes += Char.charAt(
            Math.floor(Math.random()*CharLen)
        );
    }
    return ranRes;
}