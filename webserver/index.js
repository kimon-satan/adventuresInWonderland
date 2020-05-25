
const express = require('express');
const app = express();
const port = 3000;

// require modules
const fs = require('fs');
const archiver = require('archiver');

const name = "skata001";
const Utils = require('./utils.js');
const utils = new Utils();


let DRINKME_txt;
let README_txt;
let EATME_txt;

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


app.use(express.static('public'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/popper', express.static('node_modules/@popperjs/core/dist'));

app.get('/rabbithole', (req, res) =>{


  let un = req.query.username;
  let un_enum = utils.enumString(un);
  let seed = Math.floor(Math.random()*999999);

  utils.seedTwisters(seed, un_enum, 0, 0);

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

  archive.append(dt, {name: dirPath + '/DRINKME.sh'});

  archive.finalize();

})


app.get('/eatme', (req, res) =>{

  res.attachment('EATME.sh');

  let un = req.query.username;
  let et = EATME_txt.replace("</USERNAME/>", un);

  res.send(et);

})

app.get('/lovelygarden', (req, res) =>{

  //generate the lovelygarden directory and zip it

  let un = req.query.username;

  //port to javascript

  let animals = ["mouse", "frog", "duckling_1", "duckling_2", "duckling_3", "magpie.bird", "canary.bird", "dodo.bird", "penguin.bird", "chameleon"];
  let gardenLocations = ["theLawns", "theBeds", "theWoods", "theGreenhouses", "theField"];
  //
  let lawnLocations = ["croquetLawn", "cricketLawn", "theHedgeMaze", "longGrass", "fountains"];
  // lawnSubLocations=(picnicRug deckchair picnicHamper summerhouse shadyTree wheelBarrow daffodils bluebells foxhole)
  //
  // bedsLocations=(shrubs cabbagePatch potatoes strawberries tomotatoes ornimentalFlowers daffodils pottingShed)
  // bedsSubLocations=(wateringCan bucket wheelBarrow flowerPot waterSylo)
  //
  // woodsLocations=(pond darkPath stream scrubLand steepHill swamp)
  // woodsSubLocations=(oldOakTree chestnutTree silverBirch willow antHill foxHole beeHive)
  //
  // greenhouseLocations=(strawberries tomatoes beans cucumbers pottingShed)
  // greenhouseSubLocations=(wateringCan bucket wheelBarrow)
  //
  // fieldLocations=(brokenShed oldOakTree bigHill picketFence)
  // fieldSubLocations=(scareCrow wheelBarrow abandonedTractor)
  //
  //
  // function generateSubGarden {
  // 	local count=0
  // 	local randNum=0
  // 	declare -a t2=("${!1}")
  //
  // 	while [ $count -lt ${#t2[@]} ]; do
  //
  // 		randNum=$(( (RANDOM % 10) ))
  // 		if [ $randNum -gt 5 ]; then
  // 			mkdir ${t2[$count]}
  // 		fi
  // 		let count=count+1
  //
  // 	done
  // }
  //
  // function generateGardenArea {
  //
  // 	local t1=0
  // 	local t2=0
  //
  // 	if [ "$1" == "theLawns" ]; then
  // 		t1=("${lawnLocations[@]}")
  // 		t2=("${lawnSubLocations[@]}")
  //     elif [ "$1" == "theBeds" ]; then
  // 		t1=("${bedsLocations[@]}")
  // 		t2=("${bedsSubLocations[@]}")
  //     elif [ "$1" == "theWoods" ]; then
  // 		t1=("${woodsLocations[@]}")
  // 		t2=("${woodsSubLocations[@]}")
  //     elif [ "$1" == "theGreenhouses" ]; then
  // 		t1=("${greenhouseLocations[@]}")
  // 		t2=("${greenhouseSubLocations[@]}")
  //     elif [ "$1" == "theField" ]; then
  // 		t1=("${fieldLocations[@]}")
  // 		t2=("${fieldSubLocations[@]}")
  //     fi
  //
  // 	local count=0
  //
  // 	while [ $count -lt ${#t1[@]} ]; do
  // 		mkdir ${t1[$count]}
  // 		cd ${t1[$count]}
  // 		generateSubGarden t2[@]
  // 		cd ..
  // 		let count=count+1
  // 	done
  //
  // }
  //
  //
  // function generateGarden {
  // 	local count=0
  // 	while [ $count -lt ${#gardenLocations[@]} ]; do
  // 		mkdir ${gardenLocations[$count]}
  // 		cd ${gardenLocations[$count]}
  // 		generateGardenArea ${gardenLocations[$count]}
  // 		cd ..
  // 		let count=count+1
  // 	done
  //
  // }
  //
  //
  // function placeAnimals {
  // 	local garden=( $(find lovelyGarden -mindepth 2 -type d) )
  // 	local randIdx=0
  // 	local filename=""
  // 	local animalBuffer=""
  // 	local locationBuffer=""
  //
  // 	for animal in "${animals[@]}"; do
  // 		randIdx=$(( (RANDOM % ${#garden[@]}) ))
  // 		if [ ${animal:0:8} == "duckling" ] ;then
  // 			touch $animal
  // 			echo "Hi i am a ${animal:0:8}" > $animal
  // 			echo "$animal" | cksum >> $animal
  // 			filename=$animal
  // 		elif [ $(cut -d "." -f 2 <<< $animal) == ".bird" ] ;then
  // 			touch $animal
  // 			echo "Hi i am a $animal" > $animal
  // 			echo "$animal" | cksum >> $animal
  // 			§filename=$animal
  // 		elif [ $animal == "chameleon" ] ;then
  // 			locationBuffer=$(basename ${garden[$randIdx]})
  // 			animalBuffer=$animal
  // 			filename=""
  // 			while test -n "$animalBuffer"; do
  // 				c=${animalBuffer:0:1}     # Get the first character
  // 				d=${locationBuffer:0:1}
  // 				animalBuffer=${animalBuffer:1}   # trim the first character
  // 				locationBuffer=${locationBuffer:1}
  // 				filename=${filename}$c$d
  // 			done
  //
  // 			touch $filename
  // 			echo "Hi i am a $animal" > $filename
  // 			echo "$animal" | cksum >> $filename
  // 		else
  // 			touch $animal
  // 			echo "Hi i am a $animal" > $animal
  // 			echo "$animal" | cksum >> $animal
  // 			filename=$animal
  // 		fi
  // 		mv $filename ${garden[$randIdx]}
  // 	done
  // }
  //
  // mkdir lovelyGarden
  // cd lovelyGarden
  // generateGarden
  // cd ..
  // placeAnimals
  //
  // curl -s -o lovelyGarden/caucusRace.sh http://igor.gold.ac.uk/~skata001/underland/pt1/caucusRace.sh > /dev/null && chmod 777 lovelyGarden/caucusRace.sh
  // curl -s -o lovelyGarden/instructionsFromRabbit http://igor.gold.ac.uk/~skata001/underland/pt1/instructionsFromRabbit > /dev/null
  // curl -s -o baseutils.py http://igor.gold.ac.uk/~skata001/underland/pt1/baseutils > /dev/null
  //
  // if hash python 2>/dev/null; then
  //     echo "python found">/dev/null
  // else
  //     var="#!/usr/bin/python2"
  //     sed -i '1s|.*|'$var'|' baseutils.py
  // fi
  //
  // mv baseutils.py lovelyGarden/theWoods/stream/snake.py
  // chmod 777 lovelyGarden/theWoods/stream/snake.py



  res.end();



})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
