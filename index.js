import DataManager from "./dataManager/index.js";

let dm = new DataManager();
//dm.loadData("./db/cars.json");
dm.loadData("./db/sample.json");
dm.loadSchema("./db/schema.json");

console.log("*******************Show all data********************************");
dm.show();
console.log("****************************************************************");

console.log("*******************Group By results*******************");
let grpDm = dm.groupBy("Name");
grpDm.show();
console.log("****************************************************************");


console.log("*******************Project columns*******************")
let projectDm = dm.project(["Name","Acceleration","Year"]) //cars
//let projectDm = dm.project(["Maker","Cylinders"]) //sample
projectDm.show();
console.log("****************************************************************");


console.log("*******************Select by condition*******************")
//let selectDm = dm.select("Miles_per_Gallon == 15 && Horsepower > 150") //sample
//let selectDm = dm.select("Miles_per_Gallon == 15") //cars
//let selectDm = dm.select("Maker==chevrolet&&Acceleration>8||Horsepower>=150")
let selectDm = dm.select("Miles_per_Gallon == 15 || Horsepower > 150")
selectDm.show();
console.log("****************************************************************");