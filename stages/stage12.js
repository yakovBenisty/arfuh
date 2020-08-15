var { chackId, getLastValue, findGroup } = require('../utilities')



exports.stage12  = ( req, res, next ) => {
    let payID = getLastValue(req.query.payID);
    let groupSymbol = getLastValue(req.query.groupSymbol);
    let group = findGroup(groupSymbol);
    if (chackId(payID)) {
        if (group.Payments < 6) {
            return res.end(`read=f-הקשתשלומים.n-${group.Payments}.f-תשלומים=Payments,no,1,1,5,Number,no,no,,12345`);
        } else {
            return res.end(`read=f-הקשתשלומים.n-${group.Payments}.f-תשלומים=Payments,no,2,1,5,Number,no,no,,1.2.3.4.5.6.7.8.9.10`);
        }

    } else {
        return res.end(`id_list_message=t-מספר זהות לא תקין&read=f-זהותמשלם=payID,,10,9,5,Digits,no,no,,`);
    }
}
