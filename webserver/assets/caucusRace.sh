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


function writeScoreFile(){

	rm scoreFile 2> /dev/null && touch scoreFile
	echo "$AIW_USERNAME's Score File" >> scoreFile
	echo "Part 1 - The Caucus Race" >> scoreFile
	for code in ${code_array[*]}; do
		if [[ $code == *"score_"* ]]; then
			continue
		else
			echo $code >> scoreFile
		fi
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



AIW_USERNAME="Simon"
SEED=118582

un=$1
if [[ -z $un ]] ;then
    echo "To run the caucus race you must pass your name as an argument."
    pause 1
    echo "Have another go."
    return 1 2> /dev/null || exit 1
elif [ "$un" != "$AIW_USERNAME" ] ;then
		echo ${un} "is not the person I was expecting to run this race."
		pause 1
		echo "Have another go."
		return 1 2> /dev/null || exit 1 #exit early considering if source or ./ has been used
fi

#check the working directory is lovelyGarden
wd=$(pwd)
wd=${wd: -12}

if [ $wd != "lovelyGarden" ] ;then
	echo "You must run caucusRace from inside the directory lovelyGarden."
	pause 1
	echo "Have another go."
	return 1 2> /dev/null || exit 1
fi


checkconnection

files=($(find . -maxdepth 1 -type f))
animals=( mouse frog duckling_1 duckling_2 duckling_3 magpie.bird canary.bird dodo.bird penguin.bird chameleon )
count=0
url="</URL/>/caucusrace?username=${AIW_USERNAME}&seed=${SEED}"

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
				return 1 2> /dev/null || exit 1
			else
				url="$url&${animal}_key=${k}"
			fi
		elif [ $animal = "chameleon" ]; then
			codeFound=$(echo "${item:2}" | grep -E "^[A-Za-z0-9]{15}$")
			if [ ${#codeFound} -gt 0 ] ;then
				k=$(grep -E "^[A-Za-z0-9]{15}$" ${item}) #look for a 15 char key inside the file
				if [ $k = $codeFound ]; then
					url="$url&${animal}_key=${k}"
				else
					pause 2
					echo "The file ${item} does not contain a valid key."
					pause 2
					echo "Be sure to use the correct file which you found in the garden."
					pause 2
					echo "Remove this version of ${item} and try again."
					return 1 2> /dev/null || exit 1
				fi
			fi
		fi
	done
	let count=count+1
done


res=""
count=0
until [ ! -z "$res" ]; do #wait for the result
	res=$(curl -s ${url})
	sleep 1
	let count=count+1
	if [ $count -gt 4 ] ;then
		echo "The server is not responding. Are you connected to the internet?"
		return 1 2> /dev/null || exit 1
	fi
done

IFS=', ' read -a code_array <<< $res  2> /dev/null  || IFS=', ' read -A code_array <<< $res #split the array into strings

score=${code_array[@]:0:1}
score="${score/score_/}"

if [ $score -lt 10 ]; then
	echo "Whoah steady ..."
	pause 1
	echo "You're not ready to run the caucus race just yet"
	pause 1
fi

if [ $score -eq 0 ]; then
	echo "You need to find the mouse"
	pause 1
elif [ $score -lt 2 ]; then
	echo "You need to find the frog"
	pause 1
elif [ $score -lt 5 ]; then
	echo "You need to find all the ducklings"
	pause 1
	echo "try searching for files named duckling*"
	pause 1
	echo "This means any file name starting with the name duckling"
elif [ $score -lt 9 ]; then
	echo "You need to find all the birds in the garden"
	pause 1
	echo "Try searching for files which end in the extension .bird"
	pause 1
	echo "You can do this by searching for files named *.bird"
elif [ $score -lt 10 ]; then
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
elif [ $score -eq 10 ]; then
	#Write to scoreFile on 10th time
	writeScoreFile "${code_array[@]:1:10}"
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

	head -n 2 $winner > newfile

	echo >> newFile
	echo >> newFile
	echo "Well done $AIW_USERNAME ! That was a great race." >> newFile
	echo "This is just a demo version of Adventures In Wonderland, so I'm afraid your adventure stops here." >> newFile
	echo "Here's what would happen next." >> newFile
	echo >> newFile
	echo >> newFile
	echo "Type “ls” in this directory. You will see a file called scoreFile." >> newFile
	echo "Read the file using less. You will see it some cryptic codes." >> newFile
	echo "The codes prove that you have successfully completed run the Caucus Race." >> newFile
	echo "Everyone’s code is different and personalised to them." >> newFile
	echo >> newFile
	echo >> newFile
	echo "To continue with your adventure, you need to keep this file safe." >> newFile
	echo "It will track your progress over the course of your adventure." >> newFile
	echo "Use “cp” to put a copy of it somewhere secure (eg. a dedicated subfolder in your documents folder)." >> newFile
	echo >> newFile
	echo >> newFile
	echo "I hope you enjoyed the ride. If you'd like to know more contact me at simon@simonkatan.co.uk." >> newFile

	rm $winner && mv newFile $winner


fi
