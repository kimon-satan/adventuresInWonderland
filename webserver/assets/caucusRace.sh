#!/bin/bash

declare -a arglist
declare -a joined

snakepath=./theWoods/stream/snake.py

function pause {
	local count=0
	while [ $count -lt $1 ]; do
		echo ...
	    sleep 1
	    let count=count+1
	done
}

username=$1
if [ ${#username} = 0 ] ;then
    echo "To run the caucus race you must pass your campus login as an argument."
    pause 1
    echo "Have another go."
    exit
fi



files=($(find . -maxdepth 1 -type f))
animals=( mouse frog duckling1 duckling2 duckling3 magpie.bird canary.bird dodo.bird penguin.bird chameleon )
declare -a animalsFound
declare -a finalCodes
count=0
for animal in ${animals[*]}; do
	animalsFound[$count]=false
	let count=count+1
done

hashString=""

for item in ${files[*]}; do
	count=0


	if [ $item = "./caucusRace.sh" ]; then
		continue;
	fi

	if $(grep -q "$username" "$item" > /dev/null); then

		count=0
		for animal in ${animals[*]}; do
			animalsFound[$count]=true
			let count=count+1
		done
		finalCodes[0]=${item:2}
		finalCodes[1]=${animals[6]}
		break
	fi


	for animal in ${animals[*]}; do
		hashString="$(echo $animal | cksum)"
		if $(grep -q "$hashString" "$item" > /dev/null); then
			animalsFound[$count]=true
			if [ $animal == "chameleon" ] ;then
				finalCodes[0]=${item:2}
				finalCodes[1]=${animals[6]}
			fi
		fi
  	let count=count+1
  	done
done

#echo ${animalsFound[@]}

count=0
readyForRace=true
#clear

for animal in ${animals[*]}; do

	if [ ${animalsFound[$count]} = false ] ;then
		readyForRace=false
		echo "Whoah steady ..."
		pause 1
		echo "You're not ready to run the caucus race just yet"
		pause 1
		arglist=($username $animal "000")
		if [ $animal == "mouse" ] ;then
			arglist[2]="100"
			joined=($($snakepath  ${arglist[@]}))
			echo ${joined[@]}
			echo "You need to find the $animal"
		elif [ $animal == "frog" ] ;then
				arglist[2]="101"
				joined=($($snakepath ${arglist[@]}))
				echo ${joined[@]}
				echo "You need to find the $animal"
		elif [ ${animal:0:8} = "duckling" ] ;then
			arglist[2]="102"
			joined=($($snakepath  ${arglist[@]}))
			echo ${joined[@]}
			echo "You need to find all the ducklings"
			pause 1
			echo "try searching for files named duckling*"
			pause 1
			echo "This means any file name starting with the name duckling"
		elif [  $(cut -d "." -f 2 <<< $animal) == "bird" ] ;then
			arglist[1]=".bird"
			arglist[2]="103"
			joined=($($snakepath  ${arglist[@]}))
			echo ${joined[@]}
			echo "You need to find all the birds in the garden"
			pause 1
			echo "Try searching for files which end in the extension .bird"
			pause 1
			echo "You can do this by searching for files named *.bird"
		elif [ $animal == "chameleon" ] ;then
			arglist[2]="104"
			joined=($($snakepath  ${arglist[@]}))
			echo ${joined[@]}
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
		else
			echo "You need to find the $animal"
		fi
		echo
		echo
		break
	fi
	let count=count+1
done




if $readyForRace ;then

	arglist=($username ${finalCodes[1]} "105")
	joined=($($snakepath ${arglist[@]}))
	echo ${joined[@]}

	>${finalCodes[1]}

	echo "That was a great race. Let me tell you what to do next." >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo "Type “ls” in this directory. You will see a file called aiw_$username." >> ${finalCodes[1]}
	echo "Read the file using less. You will see it has seven cryptic lines comprising your campus login" >> ${finalCodes[1]}
	echo "These codes prove that you have done these tasks properly - everyone’s code will be slightly different so don't try to copy. It won't work !" >> ${finalCodes[1]}
	echo "If you don't see seven lines then perhaps you tried to take a short cut. Short cuts don't work in Underland ;) " >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo "Use “mv” to put this file on your desktop. “~/Desktop” is a quick way to navigate to your desktop." >> ${finalCodes[1]}
	echo "KEEP THIS FILE SAFE. You will need to keep adding to it over the next five weeks in order to get your final mark. If you lose it then you have to start the game again !" >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
  echo "For the next part of the adventure you will be using version control with git" >> ${finalCodes[1]}
  echo "Have a look at http://gitlab.doc.gold.ac.uk/underland/mockturtle" >> ${finalCodes[1]}
	echo "Supporting videos and exercises are available on learn.gold under the topic week 2" >> ${finalCodes[1]}
	echo "If the resources are still locked then congratulations. You are ahead of the game ! You can find them here instead http://igor.gold.ac.uk/~skata001/underland/pt2/chameleon.html" >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
	echo >> ${finalCodes[1]}
  echo "Also if you want learn more about command line and do some practice check out the further research links on learn.gold too" >> ${finalCodes[1]}

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
	echo "But ${finalCodes[1]} has a sudden spurt of energy"
	pause 1
	echo "They cross the line. You wave the flag"
	pause 1
	echo "${finalCodes[1]} is the winner of the caucus race"
	pause 1
	echo "read their file to find out what to do next"
fi
