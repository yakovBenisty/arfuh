
exports.stage4  = ( req, res, next ) => {
    if (req.query.policyApprov == 1) {
        return res.end(`read=f-זהותתלמיד.f-ולסיום=pupilId,,10,9,5,Digits,no,no,,`);
    } else if (req.query.policyApprov == 2) {
        return res.end(`go_to_folder=/hangup`);
    }
}
