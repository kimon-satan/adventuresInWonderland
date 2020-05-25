
const express = require('express');
const app = express();
const port = 3000;

// require modules
const fs = require('fs');
const archiver = require('archiver');

const name = "skata001";
const Utils = require('./utils.js');
const utils = new Utils();


app.get('/', (req, res) =>{

  // create a file to stream archive data to.
  res.attachment('adventuresInWonderland.zip');

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

  archive.file('./assets/README', { name: 'README' });


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
  archive.file('./assets/DRINKME.sh', { name: dirPath + '/DRINKME.sh'});

  archive.finalize();

})






app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
