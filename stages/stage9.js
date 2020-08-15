var {  getLastValue, findGroup, createPupil } = require('../utilities')
var { addRegisterd } = require('../sheets');

exports.stage9  = ( req, res, next ) => {
    if (getLastValue(req.query.phone_menu) == 2) {
        return res.end(`read=f-הקשטלפון=phone,,10,10,5,Digits,no,no,,`);
    } else if (getLastValue(req.query.phone_menu) == 1) {
        let groupSymbol = getLastValue(req.query.groupSymbol);
        let group = findGroup(groupSymbol);
        if (group.price > 0) {
            return res.end(`id_list_message=t-העלות השתתפות בצהרון לשנה,${group.price}.t-שקל&read=f-שםהמשלם=name_pay,no,voice,,no`);
        } else {
            let pupil = createPupil(req, getLastValue(req.query.pupilId));
            return addRegisterd(pupil)
                        .then(() => {
                            return res.end(`id_list_message=t-ההרשמה בוצעה בהצלחה הכניסה לצהרון בתאום עם הרכזת בלבד&go_to_folder=/hangup`);
                        })
                        .catch(() => {
                            return res.send(`id_list_message=t-ישנה תקלה פנה לרכז&go_to_folder=/hangup`);
                        });
        }
    }
}
