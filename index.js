
var express = require('express');
var bodyParser = require('body-parser')
var logger = require('morgan');
var { loadClasses, loadRegisterd, loadPotential} = require('./sheets');
var { getLastQueryParm } = require('./utilities');
var { timber } = require('./timber');


const { 
    stage0,stage1, stage2, stage3,
    stage4, stage5, stage6,
    stage7, stage8, stage9,
    stage10, stage11, stage12,
    stage13, stage14, stage15,
    stage16,
} = require('./stages')


// process.env.http_proxy = "http://fgsproxyvip:8080";
// process.env.HTTP_PROXY = "http://fgsproxyvip:8080";
// process.env.https_proxy = "http://fgsproxyvip:8080";
// process.env.HTTPS_PROXY = "http://fgsproxyvip:8080";

let app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger(function (tokens, req, res) {
    timber.info("New Request",
        {
            correlationID: req.correlationID,
            req:  {
                method: tokens.method(req, res),
                url: tokens.url(req, res),
                status: tokens.status(req, res),
                "content-length": tokens.res(req, res, 'content-length'),
                "response-time": `${tokens['response-time'](req, res)} 'ms'`, 
            }
        }
    )
  }));


app.get('/', (req, res, next) => {
    req.correlationID = req.query.ApiCallId
    res.header("Content-Type", "text/html; charset=utf-8");
    let lastParm = getLastQueryParm(req.url);

    if (!lastParm) {
        return res.end(`פנייה שגוייה חסר פרמטרים`);
    }
    if (lastParm.cvv) {
        return stage16(req, res, next);
    } else if (lastParm.tokef) {
        return stage15(req, res, next);
    } else if (lastParm.credit) {
        return stage14(req, res, next);
    } else if (lastParm.Payments) {
        return stage13(req, res, next);
    } else if (lastParm.payID) {
        return stage12(req, res, next);
    } else if (lastParm.name_pay) {
        return stage11(req, res, next);
    } else if (lastParm.phone) {
        return stage10(req, res, next);
    } else if (lastParm.phone_menu) {
        return stage9(req, res, next);
    } else if (lastParm.parentId) {
        return stage8(req, res, next);
    } else if (lastParm.DateOfBirth) {
        return stage7(req, res, next);
    } else if (lastParm.name) {
        return stage6(req, res, next);
    } else if (lastParm.pupilId) {
        return stage5(req, res, next);
    } else if (lastParm.policyApprov) {
        return stage4(req, res, next);
    } else if (lastParm.classApprov) {
        return stage3(req, res, next);
    } else if (lastParm.groupSymbol) {
        return stage2(req, res, next);
    } else if (lastParm.pratim) {
        return stage1(req, res, next);
    } else {
        return stage0(req, res, next);
    }
});

app.get('/update/registers', (req, res, next) => {
    loadRegisterd();
    return res.end(`OK`);
})
app.get('/update/classes', (req, res, next) => {
    loadClasses();
    return res.end(`OK`);
})
app.get('/update/potential', (req, res, next) => {
    loadPotential();
    return res.end(`OK`);
})


app.get('/test', (req, res, next) => {
    let pupil = {
        class_id: "12345",
        First_name: " בנישתי שוקי",
        id: "123456789",
        Mobile: "0546592374",
        Mobile2: "0546592374",
        Date_birth: "01/10/1988",
        register_name: "אבישג",
        register_id: "987654321",
        end_date: "06/30/2020",
        status: ""
    }
    timber.info("Hello world", {pupil})
    return res.end(`OK`);
})

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`app now listening for requests on port ${port}`);
});

setTimeout(() => {
    loadClasses();
    loadPotential();
    loadRegisterd();
}, 1 * 1000);

//load data
setInterval(() => {
    loadClasses();
    loadPotential();
    loadRegisterd();
}, 30 * 1000);