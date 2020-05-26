#!/bin/bash

declare -a arglist
declare -a joined

#TODO check current directory

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
        echo "Could not find curl, please install it and run this script again."
				exit
    fi
}

AIW_USERNAME="</USERNAME/>"
SEED=</SEED/>

un=$1
if [[ -z $un ]] ;then
    echo "To run the caucus race you must pass your name as an argument."
    pause 1
    echo "Have another go."
    exit 1
elif [ "$un" != "$AIW_USERNAME" ] ;then
		echo ${un} "is not the person I was expecting to run this race."
		pause 1
		echo "Have another go."
		exit 1
fi

files=($(find . -maxdepth 1 -type f))
animals=( mouse frog duckling_1 duckling_2 duckling_3 magpie.bird canary.bird dodo.bird penguin.bird chameleon )
count=0
url="http://localhost:3000/caucusrace?username=${AIW_USERNAME}&seed=${SEED}"

for animal in ${animals[*]}; do
	for item in ${files[*]}; do
		if [ "${item:2}" = "$animal" ]; then
			k=$(grep -E "^[A-Za-z0-9]{15}$" ${item}) #look for a 15 char key
			if [ ${#k} = 0 ] ;then
			  pause 2
				echo "The file ${item} does not contain a valid key."
				pause 2
				echo "Be sure to use the correct file which you found in the garden."
				pause 2
				echo "Remove this version of ${item} and try again."
				exit 1
			else
				url="$url&${animal}_key=${k}"
			fi
		fi
	done
	let count=count+1
done


res=$(curl -s ${url})
until [ ${res+x} = "x" ]; do #wait for the result
	pause 1
done

if [ ${res} -lt 10 ]; then
	echo "Whoah steady ..."
	pause 1
	echo "You're not ready to run the caucus race just yet"
	pause 1
fi

if [ ${res} -eq 0 ]; then
	echo "You need to find the mouse"
	pause 1
elif [ ${res} -lt 2 ]; then
	echo "You need to find the frog"
	pause 1
elif [ ${res} -lt 5 ]; then
	echo "You need to find all the ducklings"
	pause 1
	echo "try searching for files named duckling*"
	pause 1
	echo "This means any file name starting with the name duckling"
elif [ ${res} -lt 9 ]; then
	echo "You need to find all the birds in the garden"
	pause 1
	echo "Try searching for files which end in the extension .bird"
	pause 1
	echo "You can do this by searching for files named *.bird"
elif [ ${res} -lt 10 ]; then
	echo "You need to find the chameleon - a tricky customer"
	pause 1
	echo "She disguises herself by changing her filename"
	pause 1
	echo "You need to search inside the contents of her file"
	pause 1
	echo "The command line tool grep will help you search inside for content"
	pause 1
	printf 'grep -r chameleon . \n'
	pause 1
	echo "-r means search recursively"
	pause 1
	printf 'chameleon is the search term\n'
	pause 1
	echo ". is the directory to start seaching from recursively"
	pause 1
	echo "give it a try."
elif [ ${res} -eq 10 ]; then
	pause 1
	echo "on your marks"
	pause 1
	echo "get set"
	pause 1
	echo "GO"
	pause 1
	echo "All the animals are running in a circle"
	pause 1
	echo "Mouse takes the lead"
	pause 1
	echo "But Magpie flies past him"
	pause 1
	echo "Penguin has fallen over and is out of the race"
	pause 1
	echo "But Frog has a sudden spurt of energy"
	pause 1
	echo "They cross the line. You wave the flag"
	pause 1
	echo "Frog is the winner of the caucus race"
	pause 1
	echo "read their file to find out what to do next"

	winner="frog" #TODO modify the winner and animals

	echo "That was a great race. Let me tell you what to do next." >> $winner
	echo >> $winner
	echo >> $winner
	echo "Type “ls” in this directory. You will see a file called scoreFile." >> $winner
	echo "Read the file using less. You will see it contains your name and some cryptic codes." >> $winner
	echo "The codes prove that you have successfully completed these tasks. Everyone’s code is different and personalised to them." >> $winner
	echo >> $winner
	echo >> $winner
	echo "You need to keep this file safe as it will track your progress over the course of your adventure."
	echo "Use “cp” to put a copy of it somewhere safe (eg. your documents folder)." >> $winner
	echo >> $winner
	echo >> $winner
	echo "This is just a demo version of Adventures In Wonderland so I'm afraid your adventure stops here."
	echo "I hope you enjoyed the ride. If you'd like to know more contact me at simon@simonkatan.co.uk." >> $winner

fi
