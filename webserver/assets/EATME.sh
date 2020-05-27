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

checkconnection ()
{
  local count=0
  local res=''

  if [ ! -x "$(which curl)" ]; then
    echo "Could not find curl, please install it and run this script again."
    return 1 2> /dev/null || exit 1
  fi

  until [ ! -z "$res" ]; do #wait for the result
    res=$(curl -s "</URL/>/checkin")
    sleep 1
    count=$((count+1))
    if [ $count -gt 4 ] ;then
      echo "The server is not responding. Are you connected to the internet?"
      return 1 2> /dev/null || exit 1
    fi
  done
}

function download {
    url=$1
    filename=$2

    if [ -x "$(which curl)" ]; then
        curl -o $2 -sfL $url
    else
        echo "Could not find curl, please install it and run this script again."
				return 1 2> /dev/null || exit 1
    fi
}

AIW_USERNAME="</USERNAME/>"
SEED=</SEED/>

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

checkconnection
download "</URL/>/lovelygarden?username=${AIW_USERNAME}&seed=${SEED}" lovelyGarden.zip && unzip -qq lovelyGarden.zip && rm lovelyGarden.zip
