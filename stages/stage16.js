var {  sendBillingRequest, sendKevaRequest, getLastValue, createPupil, findGroup ,findPotential } = require('../utilities');
var { timber } = require('../timber');
var { addRegisterd } = require('../sheets');

exports.stage16  = ( req, res, next ) => {
    let pupilId = getLastValue(req.query.pupilId);
    let pupil = createPupil(req,pupilId);
    let groupSymbol = getLastValue(req.query.groupSymbol)
    let group = findGroup(groupSymbol)

    var now = new Date();
    var startFrom = new Date(now.getFullYear(), now.getMonth(), 15);
    if(startFrom <= now )
        startFrom = new Date(now.getFullYear(), now.getMonth() + 1, 15);
    let day = startFrom.getDate();
    let month = startFrom.getMonth() + 1;
    let year = startFrom.getFullYear();
    day = (day < 10) ? "0" + day : day; 
    month = (month < 10) ? "0" + month : month; 

    if (group.price > 1000) {
        let kevaRequest = {
            MosadId: "7000700",
            ClientName: getLastValue(req.query.payID),
            ClientId: "",
            Token: "",
            CardId: "",
            Street: "",
            City: "",
            Phone: getLastValue(req.query.ApiPhone),
            CardNumber: getLastValue(req.query.credit),
            Tokef: getLastValue(req.query.tokef),
            Amount: group.price / getLastValue(req.query.Payments),
            Tashloumim: getLastValue(req.query.Payments),
            Groupe: "",
            Avour: `${groupSymbol}-${getLastValue(req.query.pupilId)}`,
            Zeout: getLastValue(req.query.payID),
            CVV: getLastValue(req.query.cvv),
            Currency: "1",
            Day: "15",
            StartFrom: `${day}/${month}/${year}`
        }
        timber.info("Nedarim Plus: send keva", { correlationID: req.correlationID, kevaRequest});
        return sendKevaRequest(kevaRequest)
            .then((billingRes) => {
                timber.info("Nedarim Plus Response: ", { correlationID: req.correlationID, response: billingRes.data});
                if (billingRes.data.Status === "OK") {
                    timber.log("Nedarim Plus: OK", { correlationID: req.correlationID});
                    
                    pupil.confirmation = billingRes.data.KevaId;
                    
                    timber.info("Google: send pupil", { correlationID: req.correlationID, pupil});
                    return addRegisterd(pupil)
                        .then((googleRes) => {
                                timber.info("Google Response: ", { correlationID: req.correlationID, googleRes});
                                //I need to check google answer
                                timber.log("Google: pupil added ", { correlationID: req.correlationID, pupil});
                                return res.send(`id_list_message=t- הרישום והתשלום בוצעו בהצלחה הכניסה לצהרון בתאום עם הרכזת בלבד&go_to_folder=/hangup`);
                        })
                        .catch((err) => {
                            //הילד לא נרשם בגוגל
                            timber.error("Google: Error: ", { correlationID: req.correlationID, err});
                        });
                } else if (billingRes.data.Status === "Error") {
                    timber.warn(`Nedarim Pluse Error: Status: ${billingRes.data.Status}, Message: ${billingRes.data.Message}`,{ correlationID: req.correlationID});
                    return res.send(`id_list_message=t- פרטי האשראי שגויים נסה שוב&read=f-אשראי=credit,no,20,7,5,Digits,yes,yes,,`);
                } else {
                    timber.error(`Status: ${billingRes.data.Status}, Message: ${billingRes.data.Message}` ,{ correlationID: req.correlationID, Data: billingRes.data})
                }
            })
            .catch((err) => {
                timber.error("Nedarim Plus: Error: ", { correlationID: req.correlationID, err});
                return res.send(`id_list_message=t-ישנה תקלה פנה לרכז&go_to_folder=/hangup`);
            });
    }
    else {
        let billingRequest = {
            Mosad: "7000700",
            ClientName: getLastValue(req.query.payID),
            Adresse: "",
            Mail: "",
            Phone: getLastValue(req.query.ApiPhone),
            CardNumber: getLastValue(req.query.credit),
            Tokef: getLastValue( req.query.tokef),
            Amount: group.price,
            Tashloumim: getLastValue( req.query.Payments),
            Groupe: "",
            Avour: `${groupSymbol}-${getLastValue(req.query.pupilId)}`,
            CVV: getLastValue(req.query.cvv),
            Zeout: getLastValue(req.query.payID),
            Currency: "1",
            MasofId: "Online"
        }

        timber.info("Nedarim Plus: send billiing", { correlationID: req.correlationID, billingRequest});
        return sendBillingRequest(billingRequest) 
            .then((billingRes) => {
                timber.info("Nedarim Plus Response: ", {correlationID: req.correlationID, response: billingRes.data});
                if (billingRes.data.Status === "OK") {
                    timber.log("Nedarim Plus: OK");

                    pupil.confirmation = billingRes.data.Confirmation;

                    timber.info("Google: send pupil", { correlationID: req.correlationID, pupil});
                    return addRegisterd(pupil)
                        .then((googleRes) => {
                            timber.info("Google Response: ", { correlationID: req.correlationID, googleRes});
                            //I need to check google answer
                            timber.log("Google: pupil added ", { correlationID: req.correlationID, pupil});
                            return res.send(`id_list_message=t-הרישום והתשלום בוצעו בהצלחה הכניסה לצהרון בתאום עם הרכזת בלבד&go_to_folder=/hangup`);    
                        })
                        .catch((err) => {
                            //הילד לא נרשם בגוגל
                            timber.error("Google: Error: ", { correlationID: req.correlationID, err});
                        });
                } else if (billingRes.data.Status === "Error") {   
                    timber.warn(`Nedarim Pluse Error: Status: ${billingRes.data.Status}, Message: ${billingRes.data.Message}`, { correlationID: req.correlationID});
                    return res.send(`id_list_message=t-פרטי האשראי שגויים או שלא ניתן לבצע תשלומים בכרטיס זה&read=f-הקשתשלומים.n-${group.Payments}.f-תשלומים=Payments,no,1,1,5,Number,no,no,,1`);                      
                } else  {   
                    timber.error(`Status: ${billingRes.data.Status}, Message: ${billingRes.data.Message}`, { correlationID: req.correlationID, Data: billingRes.data})
                }
            })
            .catch((err) => {
                timber.error("Nedarim Plus: Error: ", { correlationID: req.correlationID, err});
                return res.send(`id_list_message=t-ישנה תקלה פנה לרכז&go_to_folder=/hangup`);
            });
    }
}
