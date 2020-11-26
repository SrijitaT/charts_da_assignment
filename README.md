# Charts_DA_assignment

- Platform and environment details - NodeJS latest version (15.3.0), will work in any version above 12
- Detailed installation procedure - npm install
- Build Command - npm start
- Test Command - npm run test
- Usage of Data Operators-
  1. To load data and schema
  let dm = new DataManager();
  dm.loadData("./db/cars.json");
  dm.loadSchema("./db/schema.json");
  <br/><b>NB</b> - "sample.json" can also be used which is kept in db folder itself. It has few records taken from cars.json so that its easier to assess

  2. Select 
      Examples of supported arguments-
        - Acceleration > 8
        - Maker == "chevrolet" && Acceleration > 8
        - Maker == "chevrolet" || Acceleration > 8
        - Maker == "chevrolet" && Acceleration > 8 || Horsepower >= 150
        - Maker == "chevrolet" || Acceleration > 8 && Horsepower >= 150
        
        let selectDm = dm.select("Miles_per_Gallon == 15 || Horsepower > 150")
        selectDm.show();
  3. Project 
       Argument - [col1,col2,col3...]
       let projectDm = dm.project(["Name","Acceleration","Year"])
       projectDm.show();
       
  4. groupBy
      Argument - col_name which should be a dimension
      
      let grpDm = dm.groupBy("Name");
      grpDm.show();
      
  5. Show
      To see all data call dm.show()
      
 <b>Note</b> : dataManager/test/outputs has few files which has JSON outputs of various queries which I have tested while development, those can also be checkedout
