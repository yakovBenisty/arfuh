var { getLastValue, findGroup } = require('../utilities')
var { timber } = require('../timber');

exports.stage2  = (req, res, next) => {
    let groupSymbol = getLastValue(req.query.groupSymbol)
    let group = findGroup(groupSymbol);
    if (group) {
        return res.end(`read=f-שםהכיתההינו.t-${group.class_name} במוסדות ${group.institution} .f-להמשךלשמיעהחוזרת=classApprov,,1,1,5,No,,,,12`); // what happens if the class name includes a special character ??
    } else {
        return res.end(`id_list_message=f-קודכיתהשגויאולאקיים&read=f-הקשקודכיתה=groupSymbol,no,7,2,5,Digits,no,no,,`);
    }

}
