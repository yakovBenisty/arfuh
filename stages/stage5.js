var { chackId, getLastValue, findRegisterd, findPotential } = require('../utilities')


exports.stage5  = ( req, res, next ) => {
    let pupilId = getLastValue(req.query.pupilId);
    let pupils = findRegisterd(pupilId)
    if (chackId(pupilId)) {
        if (findRegisterd(pupilId)) /*rigester */ {
            return res.end(`id_list_message=t-ילד זה רשום במערכת בסמל.d- ${pupils.class_id}.t-להעברה לכיתה אחרת נא פנה לרכז תודה ולהתראות&go_to_folder=/hangup`);
        } else if (findPotential(pupilId))/*Known */ {
            return res.end(`read=f-תפריטטלפון=phone_menu,,1,1,5,No,,,,12`);
        } else {
            return res.end(`read=t- נא הקלט בקול ברור את השם הפרטי ושם המשפחה של הילד ולסיום הקש סולמית=name,no,voice,,no`);
        }
    } else {
        return res.end(`id_list_message=t-תעודת זהות שהוקשה אינה תקינה&read=f-זהותתלמיד.f-ולסיום=pupilId,,10,9,5,Digits,no,no,,`);
    }

}
