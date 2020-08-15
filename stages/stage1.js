exports.stage1  = (req, res, next) => {
    if (req.query.pratim == 1) {
        return res.end(`read=f-הקשקודכיתה=groupSymbol,no,10,1,5,Digits,no,no,,`);
    } else if (req.query.pratim == 2) {
        return res.end(`go_to_folder=/hangup`);
    }
}
