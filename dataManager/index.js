import fs from "fs";
import {evaluateRelationalExpression,compileLogicalExpression,computeLogicalExpression,compileRelationalExpression} from "./utils/stringToExp.js";

class DataManager {
    constructor(data,schema) {
      this.data = data ? data : [];
      this.schema = schema ? schema : [];
    }
    
    loadData(path){
        try{
            this.data = JSON.parse(fs.readFileSync(path));
        }catch(err){
            console.log("Could not load data ",err)
        }
    }
    loadSchema(path){
        try{
            this.schema = JSON.parse(fs.readFileSync(path)).schema;
        }catch(err){
            console.log("Could not load schema ",err)
        }
    }

    show(){
        if(this.data.length){
            let tableView = "";
            this.data.map((row,index) => {
                if(index == 0){ //header
                    tableView+="---------------------------------------------------------------------------------------------------\n";
                    Object.keys(row).map(attr => tableView+=attr+"  |   ");
                    tableView+="\n---------------------------------------------------------------------------------------------------\n";
                }
                Object.keys(row).map(attr => tableView+=row[attr]+" | ");
                tableView+="\n";
            })
            console.log(tableView);
        }else{
            console.log("Nothing to show!! Probably an error occurred!!")
        }
    }
    /*
    Method Name : Select
    Parameter Type : string
    Examples of condition supported by method:
        - Acceleration > 8
        - Maker == "chevrolet" && Acceleration > 8
        - Maker == "chevrolet" || Acceleration > 8
        - Maker == "chevrolet" && Acceleration > 8 || Horsepower >= 150
        - Maker == "chevrolet" || Acceleration > 8 && Horsepower >= 150
    */

    select(condition){
    try{
        let logicalPattern = /[{&&|||}]/g,expObj = null, hasLogicalOp = false;
        //compilation of the expression will be done once,and condition to be check inside filter
        if(logicalPattern.test(condition)){
            hasLogicalOp = true;
        }
        expObj = hasLogicalOp ? compileLogicalExpression(condition) : compileRelationalExpression(condition);
        
        let filteredData = this.data.filter(data => {
            if(!hasLogicalOp){
                return evaluateRelationalExpression(data[expObj.exp[0]],expObj.op,expObj.exp[1])
            }
            return computeLogicalExpression(expObj,data);
        })
        return this.getInstance(filteredData);
    }
    catch(err){
        console.log("Please enter correct condition format");
        return this.getInstance({data:[]});
    }
    }

    project(cols){
        if(!Array.isArray(cols) || !cols.length){
            //validate whether its an array or not
            console.log("Please enter column names in an array!")
            return this.getInstance({data:[]});
        }
        let projectedRes = this.data.map(row=>{
            let result = {};
            cols.forEach((col)=>{
                result[col] = row[col]
            })
            return result;
        })
        return this.getInstance(projectedRes);
    }


    groupBy(col_name){
        let groupSchemaByType = this.schema.reduce(function (acc, obj) {
            let key = obj["type"]
            if (!acc[key]) {
              acc[key] = []
            }
            acc[key].push(obj.name)
            return acc
          }, {})
        let {dimension,measure} = groupSchemaByType;

        if(dimension.includes(col_name)<0){ //validation
            console.log("Please enter correct col_name!!")
            return this.getInstance({data:[]});
        }


        let groupDataByColName = this.data.reduce(function (acc, obj) {
            let key = obj[col_name]
            if (!acc[key]) {
              acc[key] = []
            }else{
                measure.forEach((m)=>{
                    acc[key][0][m] += obj[m]
                })
                acc[key][0]["count"]++;
            }
            if(acc[key].length == 0){
               let newObj={[col_name]:key};
               measure.forEach((m)=>{ //include keys which only is of type measure
                   newObj[m] = obj[m]
               })
               newObj.count = 1;
               acc[key].push(newObj)
            }
            return acc
          }, {})


        let finalResAfterCalcMean = Object.keys(groupDataByColName).map(category=>{
            let result = {};
            result[col_name] = category;
            measure.forEach((m)=>{
                result[m] = groupDataByColName[category][0][m]/groupDataByColName[category][0].count
            })
            return result;
        })

        return this.getInstance(finalResAfterCalcMean);
    }

    getInstance(data){
        return new DataManager(data,this.schema);    
    }
  }

export default DataManager;