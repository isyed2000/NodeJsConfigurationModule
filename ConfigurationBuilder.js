const fs = require("fs");

var _configValues = {};

var _configLoaderPipeline = new Array();


function getValue(key)
{
		return _configValues[key];
}

function loadEnv(configuration)
{
	Object.keys(process.env).forEach(function(key) {
		
		var val = process.env[key];
		configuration[key] = val;
		
});
}

function loadConfiguration()
{
	for(var i=0;i<_configLoaderPipeline.length;i++)
	{
		loadEnvironment(_configLoaderPipeline[i]);
	}
	
}

function loadEnvironment(environmentConfiguration)
{
	if(environmentConfiguration.Type == "EnvVariable")
	{
		loadEnv(_configValues);
	}
	else if(environmentConfiguration.Type == "JsonFile")
	{
		loadJsonConfig(environmentConfiguration, _configValues);
	}
}

function loadJsonConfig(environmentConfiguration, configuration)
{
	let rawData = null;
	try
	{
  	 rawData = fs.readFileSync(environmentConfiguration.FileName);
	
	}
	catch(err)
	{
		
	
		if (err.code === 'ENOENT') {
			{
				console.log(environmentConfiguration.FileName + ' : File not found!');
				if(environmentConfiguration.Optional)
				{
					console.log("Ignoring File not found error as configuration file is marked as optional.");
				}
				else{
					console.log(err);
					console.log("Error occurred");
					throw err;
				}
			}
} else {
	
	console.log(err);
		console.log("Error occurred");
  throw err;
}
		
	}
  
  if(rawData!=null)
  {
   var config = JSON.parse(rawData);

  loadJsonRecursive(config, configuration, "");
  }
	
}

function loadJsonRecursive(jsonObject, configuration, prefix)
{
	Object.keys(jsonObject).forEach(function(key) {
		
		var val = jsonObject[key];
		if(typeof(val)=="object")
		{
			loadJsonRecursive(val, configuration, prefix+key+":");
		}
		else{
		configuration[prefix+key] = val;
		}
		
});
	
}


function printConfig()
{
	Object.keys(_configValues).forEach(function(key) {
		
		console.log("key = " + key + " value = " +  _configValues[key]);
		
});
	
}

function addJsonFile(fileName, optional)
{
	var JsonFileConfig = {Type:'JsonFile', FileName:fileName, Optional:optional};
	
	_configLoaderPipeline.push(JsonFileConfig);
	
}

function addEnvironmentVariables()
{
	var envConfig = {Type:'EnvVariable'};
	
	_configLoaderPipeline.push(envConfig);
	
}

exports.getValue = getValue;
exports.addJsonFile = addJsonFile;
exports.addEnvironmentVariables = addEnvironmentVariables;
exports.loadConfiguration = loadConfiguration;
exports.printConfig = printConfig;


