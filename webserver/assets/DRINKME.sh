#! /bin/bash

function pause {
	local count=0
	while [ $count -lt $1 ]; do
	    sleep 1
		echo ...
	    let count=count+1
	done
}

clear
pause 2
echo "You drink from the bottle labelled DRINKME and, finding it very nice, you very soon finish it off ..."
pause 2
echo "What a curious feeling!"
pause 2
echo "You are closing up like a telescope"
pause 2
echo "Now you are only 10 inches tall"
pause 2
echo "Finally you can leave this place."
pause 2
echo "Use the command 'cd ..' to move upwards by one directory at a time"
pause 2
echo "It seems you were rather careless on your journey down here. You didn't notice a certain something which would help you on your adventure."
pause 2
echo "Travel back up the rabbit hole and look for an item which you haven't seen before. You'll need some intitiative to work out what to do next."
echo
echo
echo

cd ../../../../.. #could make a random number of paths

curl -s -o EATME.sh http://localhost:3000/eatme > /dev/null && chmod 755 EATME.sh
