const Twister = require("./twister.js");
const mkdirp = require('mkdirp');
const fs = require('fs');
const execSync = require('child_process').execSync;
const deepcopy = require('deepcopy');
const assert = require('assert');


function Utils()
{
	this.twisters = [];
	this.twisterIdx = 0;
	this.seedTwisters(0, 0, 0, 0);
}

module.exports = Utils;

///////////////////////////////////////PROCEDURAL GENERATION///////////////////////////

Utils.prototype.seedTwisters = function(seed, userNum, caseNum, stage)
{
	var seed_a = seed + userNum;
	var seed_b = (userNum * 1234) % seed;
	var seed_c = seed / (caseNum + stage);
	this.twisters = [];
	this.twisterIdx = 0;
	this.twisters.push(new Twister(seed_a));
	this.twisters.push(new Twister(seed_b));
	this.twisters.push(new Twister(seed_c));
}

Utils.prototype.getRandom = function(minv, maxv)
{
	//A wrapper to return random numbers
	if (minv == undefined && maxv == undefined)
	{
		minv = 0;
		maxv = 1.0;
	}
	else if (maxv == undefined)
	{
		maxv = minv;
		minv = 0;
	}

	var r = this.twisters[this.twisterIdx].random(minv, maxv);

	//and determine which twister to use next time
	this.twisterIdx = Math.round(this.twisters[this.twisterIdx].random(0, 2));

	return r;
}

Utils.prototype.getRandomInt = function(minv, maxv)
{
	var r = this.getRandom(minv, maxv + 1);
	return Math.floor(r);
}

Utils.prototype.enumString = function(string)
{
	var res = string.charCodeAt(0);

	for (var j = 0; j < string.length; j++)
	{
		res += string.charCodeAt(j) * res;
	}

	for (var j = string.length - 1; j >= 0; j--)
	{
		res += string.charCodeAt(j) * res;
	}

	res %= 9999999;

	while (res < 1000000)
	{
		res = Math.max(1, res); //zero would create an infinte loop
		res *= 10;
		res %= 9999999;
	}

	return res;
}

/////////////////////////////GRADING////////////////////////////////////////////////



////////////////////////////FILE PREPARATION////////////////////////////////////////


Utils.prototype.createDirAsync = function(filePath)
{
	return new Promise(function(res, rej)
	{
		mkdirp(filePath, function(err)
		{
			if (err !== null) return rej(err);
			res(filePath);
		})
	});
}

Utils.prototype.readFileAsync = function(filePath)
{
	return new Promise(function(res, rej)
	{
		fs.readFile(filePath, function(err, data)
		{
			if (err !== null) return rej(err);
			return res(data);
		})
	});
}

Utils.prototype.readFilesAsync = function(filePaths)
{
	//starts with an array returns an ordered array of the data
	var output = [];

	return new Promise(function(res, rej)
	{
		var p = Promise.resolve();

		for (let i = 0; i < filePaths.length; i++)
		{

			p = p.then(_ => new Promise(function(i_res, i_rej)
			{
				this.readFileAsync(filePaths[i])
					.then((doc) =>
					{
						output.push(doc);
						i_res();
					})
			}.bind(this)));
		}

		p.then(_ =>
		{
			res(output);
		})
	}.bind(this));

}

Utils.prototype.writeFileAsync = function(data, filePath)
{
	return new Promise(function(res, rej)
	{
		fs.writeFile(data, filePath, function(err)
		{
			if (err !== null) return rej(err);
			res(filePath);
		})
	});
}

Utils.prototype.copyFileAsync = function(source, target)
{

	return new Promise(function(res, rej)
	{
		var rd = fs.createReadStream(source);
		rd.on("error", function(err)
		{
			rej(err);
		});

		var wr = fs.createWriteStream(target);
		wr.on("error", function(err)
		{
			rej(err);
		});

		wr.on("close", function(ex)
		{
			res();
		});

		rd.pipe(wr);
	});
}

Utils.prototype.copyFilesAsync = function(sources, targets)
{
	//FIXME this doesn't really need to be strictly synchronous
	//should use promise.all

	assert(sources.length == targets.length);

	return new Promise(function(res, rej)
	{
		var p = Promise.resolve();

		for (let i = 0; i < sources.length; i++)
		{

			p = p.then(_ => new Promise(function(i_res, i_rej)
			{
				this.copyFileAsync(sources[i], targets[i])
					.then(_ =>
					{
						i_res();
					})
			}.bind(this)));
		}

		p.then(_ =>
		{
			res();
		})

	}.bind(this));
}

Utils.prototype.deleteFileAsync = function(filePath)
{
	return new Promise(function(res, rej)
	{
		fs.unlink(filePath, function(err)
		{
			if (err !== null) return rej(err);
			else res();
		});
	});
};






////////////////////////////////ARRAYS////////////////////////////////////



Utils.prototype.choose = function(inputArray, num)
{
	//Shallow copy
	if (inputArray == undefined)
	{
		throw "Error: utils.choose, inputArray is undefined";
	}
	if (num == undefined) num = 1;
	if (num > inputArray.length)
	{
		throw "Error: utils.choose, number of items excedes size of input array";
	}
	var output = [];
	var ids = [];

	for (var i = 0; i < inputArray.length; i++)
	{
		ids.push(i);
	}

	for (var i = 0; i < num; i++)
	{
		var idx = this.getRandomInt(0, ids.length - 1);
		output.push(inputArray[ids[idx]]);
		ids.splice(idx, 1);
	}

	if (num == 1)
	{
		return output[0];
	}
	else
	{
		return output;
	}

}

Utils.prototype.deepChoose = function(inputArray, num)
{
	//NB. this is destructive on the inputArray too

	if (num == undefined) num = 1;
	if (num > inputArray.length)
	{
		throw "Error: utils.deepChoose, " + num + "  items excedes input array of " + inputArray.length;
	}
	var output = [];

	for (var i = 0; i < num; i++)
	{
		var idx = this.getRandomInt(0, inputArray.length - 1);
		output.push(inputArray[idx]);
		inputArray.splice(idx, 1);
	}

	if (num == 1)
	{
		return output[0];
	}
	else
	{
		return output;
	}
}

Utils.prototype.createNestedDictionary = function(keys)
{
	/*
		This function recursively creates a dictionary covering combinations of
		parameters contained in keys.

		keys is a 2D array with each sub-array representing a set of mutually exlusive values
		[["a", "b", "c"],["1", "2", "3"],["doh","rey","me"]]

		returns

		{
			a:{1: {doh: [], rey: [], me: []}, 2: {doh: [], rey: [], me: []}, 3: {doh: [], rey: [], me: []}},
			b:{1: {doh: [], rey: [], me: []}, 2: {doh: [], rey: [], me: []}, 3: {doh: [], rey: [], me: []}},
			c:{1: {doh: [], rey: [], me: []}, 2: {doh: [], rey: [], me: []}, 3: {doh: [], rey: [], me: []}}
		}

	*/

	var t_keys = keys[0];
	keys.splice(0, 1);

	var dict = {};

	for (var i = 0; i < t_keys.length; i++)
	{
		if (keys.length > 0)
		{
			dict[t_keys[i]] = this.createNestedDictionary(deepcopy(keys));
		}
		else
		{
			dict[t_keys[i]] = [];
		}
	}

	return dict;

}

Utils.prototype.buildIndex = function(dictionary)
{
	/*
		recursively build an index from a dictionary
		NB. trees of unequal depth result in null values for terminations
	*/

	var index = {};
	var k = Object.keys(dictionary);
	var nullCount = 0;

	for (var i = 0; i < k.length; i++)
	{
		if (dictionary[k[i]] instanceof Array)
		{
			//we've reached the end
			nullCount += 1;
			index[k[i]] = null;
		}
		else
		{
			index[k[i]] = this.buildIndex(dictionary[k[i]]);
		}
	}

	//there are no further objects to recurse into
	if (nullCount == k.length)
	{
		index = k;
	}

	return index;
}

Utils.prototype.createRandomisedNumberList = function(start, end)
{
	let list = [];
	for (let i = start; i <= end; i++) list.push(i);
	list = list.sort((a, b) => this.getRandomInt(0, 1) - 0.5);
	return list;
}


Utils.prototype.getRandomString = function(numChars)
{
	let alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let s = "";
	for(let i = 0; i < numChars; i++)
	{
		let r = this.getRandomInt(0,alpha.length-1);
		s+= alpha[r];
	}

	return s;
}

///////////////////////////////CODE PARSING/////////////////////////////////


Utils.prototype.numberToOrdinal = function(n)
{
	let ordinal = n.toString();
	let tails = ["th", "st", "nd", "rd"];
	if ((n < 11 || n > 19) && n % 10 < 4)
	{
		ordinal += tails[n % 10];
	}
	else
	{
		ordinal += tails[0];
	}
	return ordinal
}

//
