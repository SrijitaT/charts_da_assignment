import chai from 'chai';
import path from 'path';
import DataManager from '../index.js';
import fs from "fs";
const __dirname = path.resolve();

let dm;

describe('Data Operator tests', function () {
  beforeEach(()=>{
    dm = new DataManager();
    dm.loadData(`${__dirname}/../db/sample.json`);
    dm.loadSchema(`${__dirname}/../db/schema.json`);
  })
  describe('project(cols)', function () {
    it('it projects columns which is passed as an array ', function () {
      let projectDm = dm.project(["Maker","Cylinders"]) //sample
      const projectedResult = JSON.parse(fs.readFileSync(`${__dirname}/test/outputs/project_sample.json`));
      chai.expect(projectDm.data).to.deep.equal(projectedResult);
    });
  });

  describe('select(condition)', function () {
    it('selects rows according to the given condition : Miles_per_Gallon == 15 && Horsepower > 150', function () {
      let selectDm = dm.select("Miles_per_Gallon == 15 && Horsepower > 150") //sample
      const selectedResult = JSON.parse(fs.readFileSync(`${__dirname}/test/outputs/select_sample1.json`));
      chai.expect(selectDm.data).to.deep.equal(selectedResult);
    });
    it('selects rows according to the given condition : Cylinders!=8', function () {
      let selectDm = dm.select("Cylinders!=8") //sample
      const selectedResult = JSON.parse(fs.readFileSync(`${__dirname}/test/outputs/select_sample2.json`));
      chai.expect(selectDm.data).to.deep.equal(selectedResult);
    });
    it('selects rows according to the given condition : Cylinders >= 8 || Horsepower == 200', function () {
      let selectDm = dm.select("Cylinders >= 8 || Horsepower == 200") //sample
      const selectedResult = JSON.parse(fs.readFileSync(`${__dirname}/test/outputs/select_sample3.json`));
      chai.expect(selectDm.data).to.deep.equal(selectedResult);
    });
  });

  describe('groupBy(col_name)', function () {
    it('groups data by the given column ', function () {
      let groupDm = dm.groupBy("Name") //sample
      const groupByRes = JSON.parse(fs.readFileSync(`${__dirname}/test/outputs/groupByName_sample.json`));
      chai.expect(groupDm.data).to.deep.equal(groupByRes);
    });
  });
});