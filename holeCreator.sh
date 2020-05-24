#!/bin/bash
cd ..
oPath=$(pwd)

mkdir adventuresInWonderland
cd adventuresInWonderland

cp $oPath/pt1Files/README $oPath/adventuresInWonderland

mkdir rabbitHole
cd rabbitHole

counter=0
numDirs=12

holeObjects=(mud earth worms heapOfsticks dryLeaves cupboards teacup orangeMarmelade spoon lamp pocketwatch rockingchair dustyBook threeLeggedtable waistcoat)
directoryNames=(down andDown deeper andDeeper further andFurther)


function addItems {
	local index=$1
	local numObjs=$(( (RANDOM % 5) + 1))
	local maxIndex=$(( $index + $numObjs ))
	while [ $index -lt $maxIndex ]; do
		touch .${holeObjects[$index]}
		attrib +H .${holeObjects[$index]}
		echo "${holeObjects[$index]} is not the item you're looking for keep going ... (type q to exit less)" > .${holeObjects[$index]}
		let index=index+1
	done
}

function makeDirectory {
    local index=0
    local incr=$(( $numDirs / 3 ))
    local incr2=$(( $incr * 2 ))
    local objIdx=0
    if [ $1 -lt $incr ]; then
        let index=$(($1 % 2))
        let objIdx=0
    elif [ $1 -lt $incr2 ]; then
        let index=$(( ($1 % 2)+2 ))
        let objIdx=5
    else
        let index=$(( ($1 % 2)+4 ))
        let objIdx=10
    fi
    local currDirName=${directoryNames[$index]}
    mkdir .$currDirName
		attrib +H .$currDirName
    cd .$currDirName
    addItems $objIdx

}

while [ $counter -lt $numDirs ]; do
    makeDirectory $counter
    let counter=counter+1
done

cPath=$(pwd)
cp $oPath/pt1Files/FINDME $cPath/FINDME

mkdir theLittleDoor
cd theLittleDoor
cPath=$(pwd)

cp $oPath/pt1Files/DRINKME.sh $cPath
cp $oPath/pt1Files/anUpdateOnYourProgress $cPath
