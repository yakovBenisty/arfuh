
var { getSheets, appendValues } = require('./googleApi');
var { timber } = require('./timber');

let classesSheetsId = "1au1KbUiD3Fi5NXszhK1XbgyGeoK1PHntR1NoRe4vTwA";
let potentialSheetsId = "1au1KbUiD3Fi5NXszhK1XbgyGeoK1PHntR1NoRe4vTwA";
let registerdSheetsId = "1au1KbUiD3Fi5NXszhK1XbgyGeoK1PHntR1NoRe4vTwA";
let classesRange = "classes";
let potentialRange = "potential";
let registerdRange = "registered";

let classes = {};
let classesStructure = {};
let potential = {};
let potentialStructure = {};
let registerd = {};
let registerdStructure = {};


function loadClasses(sheetsId, range, uniqProp) {
    getSheets(sheetsId, range, (err, res) => {
        if (err)
            return timber.error('The API returned an error', {err});
        const rows = res.data.values;
        classes = parseSheet(rows, uniqProp);
        classesStructure = sheetStructure(rows);
        timber.info("Classes was updated");

    });
}
function loadPotential(sheetsId, range, uniqProp) {
    getSheets(sheetsId, range, (err, res) => {
        if (err)
            return timber.error('The API returned an error:', {err});
        const rows = res.data.values;
        potential = parseSheet(rows, uniqProp);
        potentialStructure = sheetStructure(rows);
        timber.info("Potintial was updated");
        
    });
}

function loadRegisterd(sheetsId, range, uniqProp) {
    getSheets(sheetsId, range, (err, res) => {
        if (err)
            return timber.error('The API returned an error:', {err});
        const rows = res.data.values;
        registerd = parseSheet(rows, uniqProp);
        registerdStructure = sheetStructure(rows);
        timber.info("Registerd was updated");

    });
}
function parseSheet(rows, prop){
    const row0 = rows[0];
    if (!row0.length) {
        return timber.worn('No data found.');
    }
    const propIndex = row0.findIndex((item) => {
        return item === prop;
    })

    let temp = {};
    rows.map((row) => {
        temp[row[propIndex]] = {};
        row.forEach((element, index) => {
            temp[row[propIndex]][row0[index]] = element
        });
    });
    return temp;
}
function sheetStructure(rows){
    const row0 = rows[0];
    if (!row0.length) {
        return imber.worn('No data found.');
    }
    let structure = {};
    row0.forEach((item, index) => {
        structure[item] = index;
    })
    return structure;
}


function appendRow(spreadsheetId, range, row) {
    return appendValues(spreadsheetId, range, [ row ])
        .then( result => {
            return result;
        })
        .catch( err => {
            return err; 
        });
}

function createRow( obj, structure) {
    let row = [];
    for (const key in obj ) {
        if (obj.hasOwnProperty(key) || structure.hasOwnProperty(key)) {
            row[structure[key]] = obj[key];
        }
    }
    return row;
}

exports.getClasses = () => { return classes } ;
exports.loadClasses = () => { 
    loadClasses(classesSheetsId, classesRange, "class_id")
 };


exports.getRegisterd = () => { return registerd };
exports.addRegisterd = (pupil) => { 
    let row = createRow(pupil, registerdStructure);
    return appendRow(registerdSheetsId, registerdRange, row)
} ;
exports.loadRegisterd = () => { 
    loadRegisterd(registerdSheetsId, registerdRange, "id")
 };

 exports.getPotential = () => { return potential };
 exports.addPotential = (pupil) => { 
     let row = createRow(pupil, potentialStructure);
     return appendRow(potentialSheetsId, potentialRange, row)
 } ;
 exports.loadPotential = () => { 
    loadPotential(potentialSheetsId, potentialRange, "id")
  };
