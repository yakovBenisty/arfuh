var { chackId, getLastValue } = require('../utilities')


exports.stage8  = ( req, res, next ) => {
    let parentId = getLastValue(req.query.parentId);
    let pupilId = getLastValue(req.query.pupilId);

    if (chackId(parentId)) {
        if (parentId == pupilId) {
            return res.end(`id_list_message=t-זהות הורה זהה לזהות תלמיד&read=f-זהותאב.f-ולסיום=parentId,,10,9,5,Digits,no,no,,`);
        } else {
            return res.end(`read=f-תפריטטלפון=phone_menu,,1,1,5,No,,,,12`);
        }
    } else {
        return res.end(`id_list_message=t-תעודת זהות שהוקשה אינה תקינה&read=f-זהותאב.f-ולסיום=parentId,,10,9,5,Digits,no,no,,`);
    }

}
