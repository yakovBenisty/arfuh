const axios = require('axios')
var {getClasses, getRegisterd ,getPotential} = require('./sheets');
const timber = require("./timber")

let chackId = (num) => {
    var tot = 0;
    var tz = new String(num);
    for (i=0; i<8; i++) {
        x = (((i%2)+1)*tz.charAt(i));
        if (x > 9){
            x =x.toString();
            x=parseInt(x.charAt(0))+parseInt(x.charAt(1))
        }
        tot += x;
    }
    
    if ((tot+parseInt(tz.charAt(8)))%10 == 0) {
        return true;
    } else {   
        return false;
    }
}

let sendBillingRequest = ( request ) => {
    return axios.post('https://matara.pro/nedarimplus/V6/Files/WebServices/DebitCard.aspx', null, { params: request})
}
let sendKevaRequest = ( request ) => {
    return axios.post('https://matara.pro/nedarimplus/V6/Files/WebServices/DebitKeva.aspx', null, { params: request})
}

let findGroup = (groupSymbol) => {
    let classes = getClasses();
    return classes[groupSymbol];
}

let findRegisterd = (pupilId) => {
    let pupils = getRegisterd();
    return pupils[pupilId];
    
}

let findPotential = (pupilId) => {
    let pupils = getPotential();
    return pupils[pupilId];
}

let getLastValue = (item) => {
    if (Array.isArray(item)) {
        return item[item.length - 1]
    }
    return item;
}
let getNamberValue = (item) => {
    if (Array.isArray(item)) {
        return item.length
    }
    return 1;
}

let createPupil = (req, pupilId) => {
    let currentDate = new Date()
    let groupSymbol = getLastValue(req.query.groupSymbol);
    let group = findGroup(groupSymbol);
    let pupilPote = findPotential(pupilId)
    let DateOfBirth = getLastValue(req.query.DateOfBirth);
    let pupil = {
        class_id: groupSymbol,
        First_name: getLastValue(req.query.name),
        id: getLastValue(req.query.pupilId),
        Mobile: getLastValue(req.query.phone),
        Mobile2: getLastValue(req.query.ApiPhone),
        Date_birth: DateOfBirth,
        register_name: group.price > 1 ?  getLastValue(req.query.name_pay) : "" ,
        register_id: group.price > 1 ? getLastValue(req.query.parentId) : getLastValue(req.query.parentId) ,
        register_date:  currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear(),
        end_date: "30/06/2020",
        status: "",
        Reference:""
    };
    
    
    if (pupilPote) { 
        pupil.First_name = pupilPote.First_name;
        pupil.Last_name = pupilPote.Last_name;
        pupil.Date_birth = pupilPote.Date_birth;
        pupil.Mobile = pupilPote.Mobile;
        pupil.register_name = pupilPote.register_name;
        pupil.register_id = pupilPote.register_id;


    }else{
        //no need
        pupil.Date_birth =  DateOfBirth.substr(2,2) + "/" + DateOfBirth.substr(0,2) + "/" + DateOfBirth.substr(4,4);
    }
    
    return pupil;
    
}

let = getLastQueryParm = ( url ) => {
    let regex = /[?&]([^&#]*)(=([^&#]*)|$)/g;
    let results = url.match(regex);
    if (!results) return null;
    let lastParm = results[results.length - 1];
    lastParm = lastParm.slice(1);
    lastParm = decodeURIComponent(lastParm.replace(/\+/g, ' '));
    let pos = lastParm.search("=");
    let obj = {};
    if (pos === -1) {
        obj[lastParm] = undefined;
    } else {
        obj[lastParm.slice(0, pos)] = lastParm.slice(pos + 1);
    }
    return obj;
}

exports.getLastQueryParm = getLastQueryParm;
exports.createPupil = createPupil;
exports.getLastValue = getLastValue;
exports.findPotential = findPotential;
exports.findRegisterd = findRegisterd;
exports.findGroup = findGroup;
exports.sendKevaRequest = sendKevaRequest;
exports.sendBillingRequest = sendBillingRequest;
exports.chackId = chackId;
exports.getNamberValue = getNamberValue;