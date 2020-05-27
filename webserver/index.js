
const express = require('express');
const app = express();
const argv = require('yargs').argv;

const HOME_URL = argv.url || "http://localhost:3000";
const PORT = argv.port || 3000;

// require modules
const fs = require('fs');
const archiver = require('archiver');

const name = "skata001";
const Utils = require('./utils.js');
const utils = new Utils();


let DRINKME_txt;
let README_txt;
let EATME_txt;
let caucusRace_txt;

utils.readFileAsync('assets/DRINKME.sh')
.then((doc)=>{
  DRINKME_txt = doc.toString();
})

utils.readFileAsync('assets/README')
.then((doc)=>{
  README_txt = doc.toString();
})

utils.readFileAsync('assets/EATME.sh')
.then((doc)=>{
  EATME_txt = doc.toString();
})

utils.readFileAsync('assets/caucusRace.sh')
.then((doc)=>{
  caucusRace_txt = doc.toString();
})


app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/popper', express.static('node_modules/@popperjs/core/dist'));

app.get('/rabbithole', (req, res) =>{

  let un = req.query.username;
  let un_enum = utils.enumString(un);
  let seed = Math.floor(Math.random()*999999); //TO BE STORED IN SHELL SCRIPTS

  utils.seedTwisters(seed, un_enum, 100, 1);

  let archive = prepareArchive(res,'adventuresInWonderland.zip');

  let rm = README_txt.replace("</USERNAME/>", un);

  archive.append(rm, { name: 'README' });

  let dirPath = "rabbitHole";
  let shallowItems = ["mud", "earth", "worms", "heapOfsticks", "dryLeaves"];
  let shallowNames = ["down", "andDown"];
  let numShallow = utils.getRandomInt(2,4) * 2;

  for(let i = 0; i < numShallow; i++)
  {
    let item = utils.choose(shallowItems);
    dirPath += "/." + shallowNames[i%2];
    archive.append(item + " is not the item you're looking for. Keep moving down the rabbit hole ... (type q to exit less)", { name: dirPath + "/." + item });
  }


  let numDeep = utils.getRandomInt(2,4) * 2;
  let deepNames = ["deeper", "andDeeper"];
  let deepItems = ["cupboards", "teacup", "orangeMarmelade", "spoon", "lamp"];

  for(let i = 0; i < numDeep; i++)
  {
    let item = utils.choose(deepItems);
    dirPath += "/." + deepNames[i%2];
    archive.append(item + " is not the item you're looking for. Keep moving down the rabbit hole ... (type q to exit less)", { name: dirPath + "/." + item });
  }

  let numFar = utils.getRandomInt(2,4) * 2;
  let farNames = ["further", "andFurther"];
  let farItems = ["pocketWatch", "rockingChair", "dustyBook", "threeLeggedtable", "waistCoat", "grandfatherClock"];

  for(let i = 0; i < numFar - 1; i++)
  {
    let item = utils.choose(farItems);
    dirPath += "/." + farNames[i%2];
    archive.append(item + " is not the item you're looking for. Keep moving down the rabbit hole ... (type q to exit less)", { name: dirPath + "/." + item });
  }

  dirPath += "/." + farNames[(numFar - 1)%2];
  archive.file('./assets/FINDME', { name: dirPath + '/FINDME' });

  dirPath += "/theLittleDoor";
  archive.file('./assets/anUpdateOnYourProgress', { name: dirPath + '/anUpdateOnYourProgress' });

  let numPaths = utils.getRandomInt(3,6);
  let rp = ""
  for(let i = 0; i < numPaths; i++)
  {
    if(i == 0)
    {
      rp += "..";
    }
    else
    {
      rp += "/..";
    }
  }

  let dt = DRINKME_txt.replace("</REL_PATH/>",rp);
  dt = dt.replace("</USERNAME/>", un);
  dt = dt.replace("</SEED/>", seed);
  dt = dt.replace("</URL/>", HOME_URL);

  archive.append(dt, {name: dirPath + '/DRINKME.sh'});

  archive.finalize();

})


app.get('/eatme', (req, res) =>{

  res.attachment('EATME.sh');

  let un = req.query.username;

  let et = EATME_txt.replace("</USERNAME/>", un);
  et = et.replace("</SEED/>", req.query.seed);
  et = et.replace("</URL/>", HOME_URL);

  res.send(et);

})

app.get('/lovelygarden', (req, res) =>{

  //generate the lovelygarden directory and zip it
  let un = req.query.username;
  let un_enum = utils.enumString(un);
  let seed = Number(req.query.seed);
  let archive = prepareArchive(res, 'lovelyGarden');

  utils.seedTwisters(seed, un_enum, 100, 2);

  let keys = [];
  let animals = ["mouse", "frog", "duckling_1", "duckling_2", "duckling_3", "magpie.bird", "canary.bird", "dodo.bird", "penguin.bird", "chameleon"];

  //generate the keys for the animals
  for(let i = 0; i < animals.length; i++)
  {
    keys.push(utils.getRandomString(15));
  }


  let garden = [
    {
      area: "theLawns",
      locations: ["croquetLawn", "cricketLawn", "theHedgeMaze", "longGrass", "fountains", "summerhouse","shadyTree","wheelBarrow"],
      items: ["picnicRug", "deckchair", "picnicHamper", "daffodils", "bluebells"]
    },
    {
      area: "theBeds",
      locations: ["shrubs", "cabbagePatch", "potatoes", "strawberries", "tomatoes","ornimentalFlowers", "daffodils", "pottingShed"],
      items: ["wateringCan", "bucket", "wheelBarrow", "flowerPot", "trowel"]
    },
    {
      area:"theWoods",
      locations: ["pond", "darkPath", "stream", "scrubLand", "steepHill", "swamp"],
      items: ["oldOakTree", "chestnutTree", "silverBirch", "willow"]
    },
    {
      area: "theGreenhouses",
      locations: ["strawberries", "tomatoes", "beans", "cucumbers", "pottingShed"],
      items: ["wateringCan", "bucket", "wheelBarrow","trowel"]
    },
    {
      area: "theField",
      locations: ["brokenShed", "oldOakTree", "bigHill", "picketFence"],
      items: ["scareCrow", "wheelBarrow", "abandonedTractor"]
    }];

  let generateSubGarden = function (_archive, subgarden)
  {
    let t_locations = utils.choose(subgarden.locations, subgarden.items.length);
    subgarden.locations = t_locations;

    for(let i = 0; i < subgarden.locations.length; i++)
    {
        let item = utils.deepChoose(subgarden.items);
        _archive.append("Here lies " + item + ".",{name: "lovelyGarden/" +subgarden.area + "/" + subgarden.locations[i] + "/" + item});
    }
  }

  for(let i = 0; i < garden.length; i++)
  {
    generateSubGarden(archive,garden[i]);
  }

  //place the animals

  for(let i = 0; i < animals.length; i++)
  {
    let a = utils.choose(garden);
    let l = utils.choose(a.locations);
    let fp = "lovelyGarden/" + a.area + "/" + l + "/";

    let r = /[a-z]*/.exec(animals[i]);
    let str = "Hi i am a " + r[0] + "\n";
    str += keys[i];

    if(i == animals.length - 1)
    {
      archive.append(str,{name: fp + keys[i]});
    }
    else
    {
      archive.append(str,{name: fp + animals[i]});
    }
  }


  let cr = caucusRace_txt.replace("</USERNAME/>", un);
  cr = cr.replace("</SEED/>", req.query.seed);
  cr = cr.replace("</URL/>", HOME_URL);

  archive.append(cr, {name: "lovelyGarden/caucusRace.sh"});
  archive.file('./assets/instructionsFromRabbit', {name: "lovelyGarden/instructionsFromRabbit"});

  archive.finalize();

})

app.get('/checkin', (req, res) =>{
  res.send("Hello");
})

app.get('/caucusrace', (req, res) =>{

  let un = req.query.username;
  let un_enum = utils.enumString(un);
  let seed = Number(req.query.seed);

  utils.seedTwisters(seed, un_enum, 100, 2);

  let keys = [];
  let animals = ["mouse", "frog", "duckling_1", "duckling_2", "duckling_3", "magpie.bird", "canary.bird", "dodo.bird", "penguin.bird", "chameleon"];

  //generate the keys for the animals
  for(let i = 0; i < animals.length; i++)
  {
    keys.push(utils.getRandomString(15));
  }

  let score = 0;

  for(let i = 0; i < animals.length; i++)
  {
    let k = req.query[animals[i] + "_key"];
    if(k == keys[i])
    {
      score++;
    }
    else
    {
      break;
    }
  }

  let codes = "score_" + score;

  utils.seedTwisters(seed, un_enum, 100, 3);
  //the winning codes for the score file
  for(let i = 0; i < score; i++)
  {
    codes += ", ";
    codes += String(100+i) + "_" + utils.getRandomString(10);
  }

  res.send(codes);


});


function prepareArchive(res, filename)
{
  // create a file to stream archive data to.
  res.attachment(filename);

  let archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err)
  {
    if (err.code === 'ENOENT')
    {
      // log warning
      console.log(err);
    } else {
      // throw error
      res.status(500).send({error: err.message});
    }
  });

  // good practice to catch this error explicitly
  archive.on('error', function(err) {
    res.status(500).send({error: err.message});
  });

  // pipe archive data to the file
  archive.pipe(res);

  return archive;
}



app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))
