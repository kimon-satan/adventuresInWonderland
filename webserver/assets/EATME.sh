#!/bin/bash

function pause {
	local count=0
	while [ $count -lt $1 ]; do
			sleep 0.5
		echo ...
	    sleep 0.5
	    let count=count+1
	done
}


#for the player

clear
pause 2
echo "You open the small box labelled EATME and take out a slice of cake."
pause 2
echo "Cautiously you take a bite."
pause 2
echo "You look down at the little box and realise that it is getting smaller and smaller."
pause 3
echo "Or rather you are getting larger."
pause 2
echo "Soon you are back to normal size."
pause 2
echo "In the distance you can see an entrance to the lovliest garden you ever saw."
pause 2
echo "How you long to wander about among those beds of bright flowers and those cool fountains"
pause 2
echo "Well go on ... enter the garden and explore"
echo
echo
echo

#code to generate the garden goes here

animals=( mouse frog duckling1 duckling2 duckling3 magpie.bird canary.bird dodo.bird penguin.bird chameleon )

gardenLocations=(theLawns theBeds theWoods theGreenhouses theField)

lawnLocations=(croquetLawn cricketLawn theHedgeMaze longGrass fountains)
lawnSubLocations=(picnicRug deckchair picnicHamper summerhouse shadyTree wheelBarrow daffodils bluebells foxhole)

bedsLocations=(shrubs cabbagePatch potatoes strawberries tomotatoes ornimentalFlowers daffodils pottingShed)
bedsSubLocations=(wateringCan bucket wheelBarrow flowerPot waterSylo)

woodsLocations=(pond darkPath stream scrubLand steepHill swamp)
woodsSubLocations=(oldOakTree chestnutTree silverBirch willow antHill foxHole beeHive)

greenhouseLocations=(strawberries tomatoes beans cucumbers pottingShed)
greenhouseSubLocations=(wateringCan bucket wheelBarrow)

fieldLocations=(brokenShed oldOakTree bigHill picketFence)
fieldSubLocations=(scareCrow wheelBarrow abandonedTractor)


function generateSubGarden {
	local count=0
	local randNum=0
	declare -a t2=("${!1}")

	while [ $count -lt ${#t2[@]} ]; do

		randNum=$(( (RANDOM % 10) ))
		if [ $randNum -gt 5 ]; then
			mkdir ${t2[$count]}
		fi
		let count=count+1

	done
}

function generateGardenArea {

	local t1=0
	local t2=0

	if [ "$1" == "theLawns" ]; then
		t1=("${lawnLocations[@]}")
		t2=("${lawnSubLocations[@]}")
    elif [ "$1" == "theBeds" ]; then
		t1=("${bedsLocations[@]}")
		t2=("${bedsSubLocations[@]}")
    elif [ "$1" == "theWoods" ]; then
		t1=("${woodsLocations[@]}")
		t2=("${woodsSubLocations[@]}")
    elif [ "$1" == "theGreenhouses" ]; then
		t1=("${greenhouseLocations[@]}")
		t2=("${greenhouseSubLocations[@]}")
    elif [ "$1" == "theField" ]; then
		t1=("${fieldLocations[@]}")
		t2=("${fieldSubLocations[@]}")
    fi

	local count=0

	while [ $count -lt ${#t1[@]} ]; do
		mkdir ${t1[$count]}
		cd ${t1[$count]}
		generateSubGarden t2[@]
		cd ..
		let count=count+1
	done

}


function generateGarden {
	local count=0
	while [ $count -lt ${#gardenLocations[@]} ]; do
		mkdir ${gardenLocations[$count]}
		cd ${gardenLocations[$count]}
		generateGardenArea ${gardenLocations[$count]}
		cd ..
		let count=count+1
	done

}


function placeAnimals {
	local garden=( $(find lovelyGarden -mindepth 2 -type d) )
	local randIdx=0
	local filename=""
	local animalBuffer=""
	local locationBuffer=""

	for animal in "${animals[@]}"; do
		randIdx=$(( (RANDOM % ${#garden[@]}) ))
		if [ ${animal:0:8} == "duckling" ] ;then
			touch $animal
			echo "Hi i am a ${animal:0:8}" > $animal
			echo "$animal" | cksum >> $animal
			filename=$animal
		elif [ $(cut -d "." -f 2 <<< $animal) == ".bird" ] ;then
			touch $animal
			echo "Hi i am a $animal" > $animal
			echo "$animal" | cksum >> $animal
			§filename=$animal
		elif [ $animal == "chameleon" ] ;then
			locationBuffer=$(basename ${garden[$randIdx]})
			animalBuffer=$animal
			filename=""
			while test -n "$animalBuffer"; do
				c=${animalBuffer:0:1}     # Get the first character
				d=${locationBuffer:0:1}
				animalBuffer=${animalBuffer:1}   # trim the first character
				locationBuffer=${locationBuffer:1}
				filename=${filename}$c$d
			done

			touch $filename
			echo "Hi i am a $animal" > $filename
			echo "$animal" | cksum >> $filename
		else
			touch $animal
			echo "Hi i am a $animal" > $animal
			echo "$animal" | cksum >> $animal
			filename=$animal
		fi
		mv $filename ${garden[$randIdx]}
	done
}

mkdir lovelyGarden
cd lovelyGarden
generateGarden
cd ..
placeAnimals

curl -s -o lovelyGarden/caucusRace.sh http://igor.gold.ac.uk/~skata001/underland/pt1/caucusRace.sh > /dev/null && chmod 777 lovelyGarden/caucusRace.sh
curl -s -o lovelyGarden/instructionsFromRabbit http://igor.gold.ac.uk/~skata001/underland/pt1/instructionsFromRabbit > /dev/null
curl -s -o baseutils.py http://igor.gold.ac.uk/~skata001/underland/pt1/baseutils > /dev/null

if hash python 2>/dev/null; then
    echo "python found">/dev/null
else
    var="#!/usr/bin/python2"
    sed -i '1s|.*|'$var'|' baseutils.py
fi

mv baseutils.py lovelyGarden/theWoods/stream/snake.py
chmod 777 lovelyGarden/theWoods/stream/snake.py
