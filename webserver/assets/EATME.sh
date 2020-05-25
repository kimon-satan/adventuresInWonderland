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


function download {
    url=$1
    filename=$2

    if [ -x "$(which curl)" ]; then
        curl -o $2 -sfL $url
    else
        echo "Could not find curl, please install it and run this script again." >&2
    fi
}

USERNAME=</USERNAME/>

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

download http://localhost:3000/lovelygarden?username=${USERNAME} lovelyGarden.zip && unzip lovelyGarden.zip && rm lovelyGarden.zip
