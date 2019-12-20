const fs = require("fs");

var _configValues = {};

var _ConfigLoaderPipeline = new Array();


function getValue(key)
{
		return _configValues[key];
}

function LoadEnv(configuration)
{
	Object.keys(process.env).forEach(function(key) {
		
		var val = process.env[key];
		configuration[key] = val;
		
});
}

function LoadConfiguration()
{
	for(var i=0;i<_ConfigLoaderPipeline.length;i++)
	{
		LoadEnvironment(_ConfigLoaderPipeline[i]);
	}
	
}

function LoadEnvironment(environmentConfiguration)
{
	if(environmentConfiguration.Type == "EnvVariable")
	{
		LoadEnv(_configValues);
	}
	else if(environmentConfiguration.Type == "JsonFile")
	{
		LoadJsonConfig(environmentConfiguration, _configValues);
	}
}

function LoadJsonConfig(environmentConfiguration, configuration)
{
	let rawData = null;
	try
	{
  	 rawData = fs.readFileSync(environmentConfiguration.FileName);
	
	}
	catch(err)
	{
		if (err.code === 'ENOENT') {
  console.log('File not found!');
} else {
  throw err;
}
		console.log(err);
		console.log("Error occurred");
		
	}
  
  if(rawData!=null)
  {
   var config = JSON.parse(rawData);

  LoadJsonRecursive(config, configuration, "");
  }
	
}

function LoadJsonRecursive(jsonObject, configuration, prefix)
{
	Object.keys(jsonObject).forEach(function(key) {
		
		var val = jsonObject[key];
		if(typeof(val)=="object")
		{
			LoadJsonRecursive(val, configuration, key+":");
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

function AddJsonFile(fileName, optional)
{
	var JsonFileConfig = {Type:'JsonFile', FileName:fileName, Optional:optional};
	
	_ConfigLoaderPipeline.push(JsonFileConfig);
	console.log(_ConfigLoaderPipeline.length);
}

function AddEnvironmentVariables()
{
	var envConfig = {Type:'EnvVariable'};
	
	_ConfigLoaderPipeline.push(envConfig);
	console.log(_ConfigLoaderPipeline.length);
}

exports.GetValue = getValue;
exports.AddJsonFile = AddJsonFile;
exports.AddEnvironmentVariables = AddEnvironmentVariables;
exports.LoadConfiguration = LoadConfiguration;
exports.PrintConfig = printConfig;


