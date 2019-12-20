var configuration = require("../configurationBuilder");

console.log("Configuratin Loader Demo.");

configuration.addJsonFile("configs/appSettings.json", false); //requires this file.  If not found, an error will be displayed.
configuration.addJsonFile("./connectionStrings.json", true); //Does not require this file.
configuration.addEnvironmentVariables();
configuration.loadConfiguration();
//configuration.printConfig();

console.log("First Name " + configuration.getValue("FirstName"));
console.log("Municipality code " + configuration.getValue("Address:TownshipDetails:MunicipilatyCode"));
console.log("Demo End.");