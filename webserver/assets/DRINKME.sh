#! /bin/bash

function pause {
	local count=0
	while [ $count -lt $1 ]; do
	    sleep 0.5
		echo ...
			sleep 0.5
	    let count=count+1
	done
}

function download {
    url=$1
    filename=$2

    if [ -x "$(which curl)" ]; then
        curl -o $2 -sfL $url
    else
        echo "Could not find curl, please install it and run this script again." >&2
    fi
}

REL_PATH=</REL_PATH/>
USERNAME=</USERNAME/>

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


download http://localhost:3000/eatme?username=${USERNAME} EATME.sh && mv EATME.sh ${REL_PATH}
