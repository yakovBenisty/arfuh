var { getLastValue, findGroup  } = require('../utilities')


exports.stage3  = ( req, res, next ) => {
    let classApprov = getLastValue(req.query.classApprov);
    if (classApprov == 1) {
        return res.end(`read=f-לאישורתנאיהרישום=policyApprov,,1,1,5,No,,,,12`);
    } else if (classApprov == 2) {
        let groupSymbol = getLastValue(req.query.groupSymbol)
        let group = findGroup(groupSymbol);
        return res.end(`read=f-שםהכיתההינו.t-${group.class_name}.f-להמשךלשמיעהחוזרת=classApprov,,1,1,5,No,,,,12`); // what happens if the class name includes a special character ??

    }
}
