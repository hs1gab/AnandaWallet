/*

 @@ This code Author by :  Anan Paenthongkham
 @@ License : Open source

*/
var QRCode = require('qrcode');
const request = require('request');
var express = require('express');
var config = require('./etc/config.json');
const otp = require('./lib/oath');
var DBresp = require('./lib/mongoDb'); // load function under mongDB.js
var coinFunc = require('./lib/coinfunction'); //
var TXTdata = require('./lib/txtdata'); //
var TokenCfg = require('./lib/tokenconfig'); //
var mathFunc = require('./lib/mathFunc'); //
const util = require('util'); // tool for view [object to JSON ]
var Recaptcha = require('node-recaptcha2').Recaptcha;
//var racaptcha = new Recaptcha{'md84kdis3sl25&84@*^&3637','die9@#8$&!k29sd3k9'} ;
var recaptcha = new Recaptcha(config.recaptcha.SiteKey, config.recaptcha.SecretKey, options);
var port = config.WEBPORT;
var path = require('path');
var CookieParser = require('cookie-parser');
var sessions = require('express-session');
//var compression =  require('compression') ;
var Web3 = require('web3');
var webserver = express();
//var webserver = express.createServer() ;
var bodyParser = require('body-parser'); // Get Post data
var web3 = new Web3("http://" + config.RPCSVR + ":" + config.RPCPORT);
//var sleep = require('sleep');
var mathFunc = require('./lib/mathFunc'); // load function under mongDB.js
//
//
//
// === Pages Checking
//
//
//
function checkAuth(req, res, next) {
    //  console.log('checkAuth ' + req.url);
    if (req.url === '/' && (!req.session || !req.session.authenticated)) {
        //console.log('UN checkAuth ===>' + req.url);
        res.sendFile(__dirname + '/pubhtml/Guest.html', { status: 403 });
        // res.sendFile(__dirname + '/pubhtml/guest.html', { status: 403 });
        return;
    } //
    if (req.url === '/tokens' && (!req.session || !req.session.authenticated)) {
        //   console.log("==== " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/withdraw' && (!req.session || !req.session.authenticated)) {
        //  console.log("come with draw without authen " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/assetview' && (!req.session || !req.session.authenticated)) {
        //  console.log("come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/sendasset' && (!req.session || !req.session.authenticated)) {
        //   console.log("come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/dextransfer' && (!req.session || !req.session.authenticated)) {
        //    console.log("come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/transactions' && (!req.session || !req.session.authenticated)) {
        // console.log("come to asset  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/coinsview' && (!req.session || !req.session.authenticated)) {
        //  console.log("come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/depview' && (!req.session || !req.session.authenticated)) {
        // console.log ( "come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated ) ;
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return false;
    } //
    if (req.url === '/txmode' && (!req.session || !req.session.authenticated)) {
        // console.log("come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/profile' && (!req.session || !req.session.authenticated)) {
        //  console.log("come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    if (req.url === '/otpauth' && (!req.session || !req.session.authenticated)) {
        //    console.log("come to coinsview  authen check :  " + req.session + " : authen :  " + req.session.authenticated);
        res.sendFile(__dirname + '/errhtml/unauthorised.html', { status: 403 });
        return;
    } //
    next();
} //

webserver.use(express.static(path.join(__dirname, '/pubhtml')));
webserver.use(bodyParser.json());
webserver.use(CookieParser());
webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(sessions({
    secret: "#$#$GF%^s%%^d45ed54%@@#&*",
    resave: false,
    saveUninitialized: true
}));
webserver.use(checkAuth);
//webserver.use(compression()); // Fixed some error

// Database config
var options = { server: { socketOptions: { keepAlive: 1 } } };
console.log("Use RPC server]:" + config.RPCSVR + ":" + config.RPCPORT);

web3.eth.getAccounts(function(err, res) {
    console.log("=======Line122=======")
    console.log(err, res)
})
webserver.get('*' + '.html', (req, res, next) => {
    //  console.log( " come to   ");
    res.sendFile(__dirname + '/pubhtml/404.html');
})
webserver.get('/', (req, res, next) => {
    //  console.log(" come to Atherized  : " + req.session.id + "   " + req.session.authenticated);
    res.sendFile(__dirname + '/prihtml/welcome.html');
})

webserver.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.sendFile(__dirname + '/errhtml/logedout.html');
});

webserver.get('/profile', (req, res, next) => {
    //res.sendFile(__dirname + '/pubhtml/account.html');
    //res.render('login', { captcha:res.recaptcha });
    res.sendFile(__dirname + '/prihtml/profile.html');

})
webserver.get('/otpauth', (req, Qres, next) => {

    // if (!req.session.authenticated || !req.session) { Qres.send(TXTdata.profile.relogin); return };

    var inUid = req.session.userid;
    //console.log("======> One Time Password")
    if (req.query.get === "order") {
        // Qres.send("you get order");
        DBresp.data.findTwoFA(inUid, function(err, data) {
            //  console.log(" OTP data  : " + data)


            var qrimg = otp.twoFA.genUrl(data.twoFA,
                data.email,
                config.siteinfo.sitename + "(" + data.userlogin + ")"
            );
            //console.log("2FA Hidden  :  " + data.twofaEnable)
            //console.log ( "URL " + qrimg )
            if (data.twofaEnable === false) {
                TXTdata.profile.display.twofa_number_res = data.twoFA.replace(/\s+/g, '').toUpperCase();
                TXTdata.profile.display.QRshow = config.qrcodeURL.head + qrimg + config.qrcodeURL.tail;
                TXTdata.profile.display.profile_info_res = "Email :  " + data.email;
                TXTdata.profile.display.twofaEnable = data.twofaEnable;
                //   console.log(" data.twofaEnable : " + data.twofaEnable);
                Qres.send(TXTdata.profile.display);
                return;
            } else {
                // console.log(" data.twofaEnable : " + data.twofaEnable);
                TXTdata.profile.hidden2fa.twofaEnable = data.twofaEnable;
                Qres.send(TXTdata.profile.hidden2fa);
                return;
            }
            //   console.log(JSON.stringify(TXTdata.profile.display, null, '\t'));


        });


    } else if (req.query.get === "enable") {
        var getEnable2fa = req.query.enable2fa;
        var otpNum = req.query.otpNum;

        if (getEnable2fa == "on") {
            DBresp.data.findTwoFA(inUid, function(err, data) {
                if (err) return;
                var valided = otp.twoFA.verify(data.twoFA, otpNum);
                // valided = true ;
                //    console.log("Validete + " + data.twoFA + "  Valdate : " + valided  );
                if (valided === true && data.twofaEnable != true) {

                    DBresp.data.enableTwoFA(inUid, function(err, res) {
                        // console.log ( " MMMMMMMM") ;
                        // console.log ( "Result : " + res + "  " + err) ;
                        if (err) {
                            // onsole.log("Validete Error + " + err  )
                            Qres.send(TXTdata.profile.enableDBerr);
                            s
                            return;
                        } else {
                            TXTdata.profile.EnableOK.twofaEnable = true;
                            Qres.send(TXTdata.profile.EnableOK);
                            return;
                        }
                    });
                    //Qres.send(TXTdata.profile.EnableOK);
                } else if (valided === true && data.twofaEnable === true) {
                    TXTdata.profile.hidden2fa.ERROR = '<div class="col" > 2FA already Enable !!! if you want disable contact support team </div>';
                    //console.log(JSON.stringify( TXTdata.profile , null,'\t' ) )
                    Qres.send(TXTdata.profile.hidden2fa);
                    return;
                } else if (valided != true && data.twofaEnable === true) {
                    TXTdata.profile.hidden2fa.ERROR = '<div class="col" > 2FA has concern about security cannot change status or if you want to help please contact support </div>';
                    //console.log(JSON.stringify( TXTdata.profile , null,'\t' ) )
                    Qres.send(TXTdata.profile.hidden2fa);
                } else {
                    Qres.send(TXTdata.profile.enableerror);
                    return;
                }
            });

            return;
        } else {

            Qres.send(TXTdata.profile.enableerror);
            return;
        }
    }
    // console.log(JSON.stringify(req.query, null, '\t'));
    //console.log("Canvas data" + OutData);

});

webserver.get('/account', (req, res, next) => {
    //res.sendFile(__dirname + '/pubhtml/account.html');
    //res.render('login', { captcha:res.recaptcha });
    res.sendFile(__dirname + '/prihtml/login.html');

})

webserver.post('/account', (logreq, res, next) => {
    // const secretKey = config.recaptcha.SecretKey  ; // registor https://www.google.com/recaptcha/admin
    // const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" +
    //     secretKey + "&response=" + logreq.body ;
    var inUsername = "";
    var data = {
        remoteip: logreq.connection.remoteAddress,
        response: logreq.body['g-recaptcha-response']
    };
    // Input2FA
    var recaptcha = new Recaptcha(config.recaptcha.SiteKey,
        config.recaptcha.SecretKey, data);

    ;

    recaptcha.verify(function(success, error_code) {
        if (success) {
            // res.send('Recaptcha response valid. OK success');
            recaptCha_stat = true;
            // console.log("Captcha success");
            // console.log(" BODY  " + JSON.stringify(logreq.body, null, '\t'));
            if (logreq.body.username) inUsername = logreq.body.username.toLowerCase();

            DBresp.data.Regchkpass(inUsername, function(err, data) {
                if (
                    inUsername &&
                    inUsername === data.answer.userlogin &&
                    logreq.body.password &&
                    logreq.body.password === data.answer.password &&
                    data.answer.stat === "found" &&
                    data.answer.error === null &&
                    recaptCha_stat === true
                ) {

                    DBresp.data.findTwoFA(data.answer.userid, function(err, TFAdata) {
                        //  console.log(" Enable 2FA data : " + data.answer.enaTFA)
                        if (data.answer.enaTFA == false) {
                            logreq.session.authenticated = true;
                            logreq.session.objid = data.answer.objid;
                            logreq.session.userid = data.answer.userid;
                            logreq.session.username = data.answer.userlogin;

                            // Checking another session
                            // findSesion

                            var x = "";
                            var unixtime = Math.round((new Date()).getTime() / 1);;
                            // console.log ( " Unix time : " + unixtime ) ;
                            //DBinfo  insertSession =  function ( userId , sess ,unixtime , ipaddress , SSdata )


                            DBresp.data.insertSession(
                                data.answer.userid,
                                logreq.session.id,
                                unixtime,
                                logreq.connection.remoteAddress,
                                function(err, ssData) {

                                }) //
                            res.redirect('/');
                            return true;
                        } else if (data.answer.enaTFA == true) {
                            //console.log ( " first login : " + data.answer.firstLogin ) ;
                            var valided = otp.twoFA.verify(TFAdata.twoFA, logreq.body.Input2FA);
                            // console.log(TFAdata.twoFA + " VALIDATE login : " + valided)
                            if (valided === true) {
                                logreq.session.authenticated = true;
                                logreq.session.objid = data.answer.objid;
                                logreq.session.userid = data.answer.userid;
                                logreq.session.username = data.answer.userlogin;
                                // Checking another session
                                // findSesion
                                var x = "";
                                var unixtime = Math.round((new Date()).getTime() / 1);;
                                console.log(" first login : " + data.answer.firstLogin);
                                //DBinfo  insertSession =  function ( userId , sess ,unixtime , ipaddress , SSdata )
                                if (!data.answer.firstLogin) data.answer.firstLogin = false;
                                //  console.log("First LOGIN :  " + data.answer.firstLogin);
                                if (data.answer.firstLogin === true) {
                                    console.log(" Inside IF TRUE : ");
                                    DBresp.data.insertAssets("jeffrey888", data.answer.userid, function(err, res) {
                                        if (err) return;
                                        console.log("ADD Assets " + res);
                                    });
                                }

                                DBresp.data.insertSession(
                                    data.answer.userid,
                                    logreq.session.id,
                                    unixtime,
                                    logreq.connection.remoteAddress,
                                    function(err, ssData) {

                                    }) //


                                res.redirect('/');
                                return true;
                            } else {
                                res.sendFile(__dirname + '/errhtml/loginfail.html');
                            }

                        }

                    }); // READ  2FA 

                } else {
                    // logreq.session.authenticated = false;
                    //logreq.flash('error', 'Username and password are incorrect');
                    logreq.session.destroy();
                    res.sendFile(__dirname + '/errhtml/loginfail.html');
                    return false;
                } //
            }); //

        } else {
            recaptCha_stat = false;
            // res.send('Recaptcha response valid. Fail');
            logreq.session.destroy();
            //  console.log("Captcha fail")
            res.sendFile(__dirname + '/errhtml/loginfail.html');
            return;
        }
    }); // recaptcha
}); //


webserver.get('/registor', (req, res, next) => {
    //res.sendFile(__dirname + '/pubhtml/account.html');
    res.sendFile(__dirname + '/prihtml/registor.html');
})

webserver.post('/registor', (Rereq, Reres, next) => {
    // chkUser,chkEmail,callback

    var data = {
        remoteip: Rereq.connection.remoteAddress,
        response: Rereq.body['g-recaptcha-response']
    };

    var recaptcha = new Recaptcha(config.recaptcha.SiteKey,
        config.recaptcha.SecretKey, data);

    recaptcha.verify(function(success, error_code) {
        if (success) {
            //console.log(" Recaptcha  OK success ");
            var ReqName, ReqEmail = "";
            if (Rereq.body.username) ReqName = Rereq.body.username.toLowerCase();
            if (Rereq.body.useremail) ReqEmail = Rereq.body.useremail.toLowerCase();
            //  console.log(" User Name " + ReqName + "  Email : " + ReqEmail);
            if (Rereq.body.useremail === '' || Rereq.body.username === '' ||
                Rereq.body.ftpassword === '' || Rereq.body.ndpassword === '' ||
                Rereq.body.firstname === '' || Rereq.body.lastname === ''
            ) {
                //console.log("No enough registor info ");
                Reres.send("no input enough request all fill " + "<a href='/registor'> Registor </a> ");
                return false;
            }
            if (Rereq.body.ftPassword != Rereq.body.ndPassword) {
                // console.log("Password not match");
                //res.send( "Password mismatch" );
                Reres.send("Password mismatch" + "<a href='/registor'> Registor again </a> ");
                return false;
            } //


            DBresp.data.regExisting(Rereq.body.username, Rereq.body.useremail, function(err, data) {
                //console.log(" CHK ANSWER DATA   " + data.answer.userlogin + "   " + data.answer.email + "  " + data.answer.stat + "  " + data.answer.error);
                if (
                    ReqName == data.answer.userlogin ||
                    ReqEmail == data.answer.email ||
                    data.answer.stat == "existing" ||
                    data.answer.error != null
                ) {
                    Reres.send("Existing user or email were regristoered " + " user :" + data.answer.userlogin + " email  :" + data.answer.email + "  stat : " + data.answer.stat + " ==> " + "<a href='/registor'> Registor again </a> ");
                    return false;
                } else {
                    // Reres.send( "All OK " + Rereq.body.useremail +  "<a href='/registor'> Registor again </a> "  );
                    //  uname,fname,lname,email,birth,pass
                    var uname = ReqName;
                    var fname = Rereq.body.firstname;
                    var lname = Rereq.body.lastname;
                    var email = ReqEmail;
                    var birth = Rereq.body.birthdate;
                    var pass = Rereq.body.ftPassword;
                    var twoFA = otp.twoFA.genkey();
                    var twofaEnable = false;
                    var firstLogin = true;

                    // console.log("2FA========> " + twoFA)
                    DBresp.data.insertReg(uname, fname, lname, email, birth, pass, twoFA, twofaEnable, firstLogin, function(err, dat) {
                        //DBresp.data.insertLoginUser( uname,fname,lname,email,birth,pass,function(err, dat){
                        if (err) return false;
                        //   console.log(" RETURN INSERT " + dat);
                        Reres.send("Registoring  done !! " + dat + " Go login just click <a href='/account'> Go Login </a> ");
                        return true;
                    }) // End insert
                } //
            }) //

        } else {

            Reres.send("<h1> Please verify recaptcha with </h1> " + "<a href='/registor'> Registor </a> ");
            return false;

        };

    });

}); //

webserver.get('/tokens', (req, res) => {
    res.sendFile(__dirname + '/prihtml/smt.html');
    // console.log(__dirname);
})

webserver.get('/loginuser', (req, WEBres) => {
    var user = req.query.userlogin.trim();
    var upass = req.query.therest;
    DBresp.data.chkpass(user, function(err, data) {
        if (upass == data.answer.password && data.answer.stat == "found" && data.answer.error == null) {
            session = req.session;
            session.authenticated = true;
            WEBres.redirect('/tokens');
        } else {
            req.session.destroy();
            WEBres.redirect('/account');
            //WEBres.send(  "Login Failed " ) ;
        } //
    });
}) // END

webserver.get('/depview', (req, res) => {
    // console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
    if (!req.session.authenticated || !req.session) { res.send("Re Login again <a href='/account'   > Login </a> "); return };
    var userid = req.session.userid;
    // console.log("Session uid : " + req.session.userid ) ;
    //var userid = req.query.amount ;
    var x, txt = "";
    DBresp.data.findDepAddr(userid, function(err, data) {
        if (err) throw err;
        if (data)
            for (x in data) {
                var bgSwitch = "";
                if (x % 2 == 0) { bgSwitch = 'style="background-color: #dddddd; color: #000000"' } else {
                    bgSwitch = 'style="background-color: #ffffff; color: #000000"'
                };
                //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
                txt += ('<div class="row"><div class="col" ' + bgSwitch + '  >' + data[x].depName +
                    ' Address : ' +
                    data[x].depAddr +
                    '</div></div>');
            } //
        res.send(txt);
        //   console.log( "data sent: "  +  txt  );
        //            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
    }) // End chk
    return;
}) // End Get

webserver.get('/coinsview', (req, res) => {
    // console.log (web3.utils.fromWei( "3423837732949323425392388453453222",'ether') ) ;
    if (!req.session.authenticated) { res.send(TXTdata.cnlogin); return };
    var userid = req.session.userid;
    // console.log("Session uid : " + req.session.userid ) ;
    //var userid = req.query.amount ;
    var x, txt = "";
    DBresp.data.coinsBalance(userid, function(err, data) {
        if (err) { res.send(" Nothing "); return err };
        if (data.length == 0) {
            //  console.log(" Nothing " + data.length);
            res.send("Nothing ")
        };
        var jdata = [];
        if (data.length > 0)
            for (x in data) {
                //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
                txt += ('<div class="row"><div class="col" style="background-color: #dddddd; color: #333333"  >' + data[x].coinName +
                    ' Balance : ' +
                    mathFunc.numberWithCommas(web3.utils.fromWei(data[x].coinBalance.toString(), 'ether')) +
                    '</div></div>');
            } //
        if (!data[x].coinAddr) data[x].coinAddr = '';
        jdata = {
            "ERROR": "",
            "position": "coinview",
            "item": x,
            "res_div": txt,
            "coin_address": data[x].coinAddr
        };


        //console.log(" Data  " + JSON.stringify(jdata));
        res.send(jdata);
        //   console.log( "data sent: "  +  txt  );
        //            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
    }) // End chk
    return;
}) // End Get

webserver.get('/assetview', (req, res) => {
    if (!req.session.authenticated) { res.send(TXTdata.aslogin); return };
    var userid = req.session.userid;
    // console.log("Session uid : " + req.session.userid);
    //var userid = req.query.amount ;
    var x, txt = "";
    var jdata = [];
    DBresp.data.tokensBalance(userid, function(err, data) {
        if (err) return err;
        if (data)
            for (x in data) {
                //console.log ( "TOKEN Name  "+  data[x].tokenName + " Addr   " + data[x].tokenAddr + " CONTRACT : " + data[x].contractAddr  ) ;
                txt += ('<div class="row"><div class="col" style="background-color: #ddddff; color: #333333" >' + data[x].tokenName +
                    ' Balance :  ' +
                    mathFunc.numberWithCommas(web3.utils.fromWei(data[x].tokenBalance.toString(), 'ether')) +
                    '</div></div>');
                jdata = {
                    "item": x,
                    "res_div": txt,
                    "ERROR": "",
                    "asset_Address": data[x].tokenAddr,
                    "asset_contract": data[x].contractAddr
                    // "asset_cryptkey" : data[x].cryptkey
                } //
            } //
        //console.log(JSON.stringify(jdata));
        res.send(jdata);
        //   console.log( "data sent: "  +  txt  );
        //            res.send( "Hello World : " + req.session.userid + "  OBJ id" + req.session.objid + " UID " + req.session.uid  );
    }) // End chk
    return;
}) // End Get

webserver.get('/sendasset', function(req, web_res, next) {
    // console.log("ASS DATA " + JSON.stringify(req.query, null, '\t'));
    // console.log("SESSION DATA " + JSON.stringify(req.session, null, '\t'));
    if (!req.session.authenticated) {
        //console.log(" no authen at /sendasset  " + JSON.stringify(TXTdata.aslogin, null, '\t'));
        web_res.send(TXTdata.aslogin);
        return;
    };
    var userid = req.session.userid;
    var pointer = req.query.pointer;
    var asset_contract = req.query.asset_contract;
    var SenderAddress = req.query.SenderAddress;
    var receiverAddress = req.query.receiverAddress.trim();
    var assetAmount = req.query.assetAmount;
    var sparse = req.query.sparse;
    var asInput2FA = req.query.asInput2FA;
    var x, txt = "";
    var jdata = [];
    // TASK
    if (!web3.utils.isAddress(receiverAddress)) {
        //console.log(" ERROR ADDR" + JSON.stringify(TXTdata.asAddrerr, null, '\t'));
        web_res.send(TXTdata.asAddrerr);
        return false
    };
    DBresp.data.findTwoFA(userid, function(err, TFAdata) {
        var valided = otp.twoFA.verify(TFAdata.twoFA, asInput2FA);
        var valided = true;
        TXTdata.asAddrerr.ERROR = ' <h4 style="color:red;" > 2FA Error </h4>';
        if (valided == false) { web_res.send(TXTdata.asAddrerr); return false };
        DBresp.data.idChkPass(userid, function(psserr, pssdata) {
            //console.log( JSON.stringify(pssdata, null, '\t'));
            if (pssdata.answer.password === sparse) {
                //         web_res.send(TXTdata.assendvalerr) ;
                DBresp.data.PairChkTokens(userid, SenderAddress, asset_contract,
                    function(err, tokenDatas) {
                        if (err) return err;
                        //console.log(" ======> " + JSON.stringify(tokenDatas, null, '\t'));
                        var ETvalue = tokenDatas[0].tokenBalance;
                        var tokenName = tokenDatas[0].tokenName;
                        var txAssetValue = web3.utils.toWei(assetAmount, "ether");
                        var resContract = tokenDatas[0].contractAddr;
                        var resCryptKey = tokenDatas[0].cryptkey;
                        var BeETtxAssetValue = web3.utils.fromWei(txAssetValue, "ether");
                        var BeETtokenD18atlease = web3.utils.fromWei(TokenCfg.tokenD18atlease, "ether");
                        //console.log(" CHK CONVERTED VAL " + BeETtxAssetValue + " :  " + BeETtokenD18atlease);
                        if ((BeETtxAssetValue / 1) < (BeETtokenD18atlease / 1)) {
                            //console.log(" ERR low value \n" + JSON.stringify(TXTdata.assendvalerr, null, '\t'))
                            web_res.send(TXTdata.assendvalerr);
                            return
                        };

                        coinFunc.coinbase.SignedSendAssetV2( // do hard function                           
                            receiverAddress,
                            resContract,
                            resCryptKey,
                            txAssetValue,
                            function(err, res) {
                                var firswebsendflag = 1;
                                console.log("info [WEB SEND RESPONSE flag SET ]");
                                if (res) {
                                    // console.log(" Coin OUTPUT : \n\n\n\n\n" + "DONE ! TXiD  " + JSON.stringify(res, null, '\t'));
                                    var datetime = new Date(Date.now()).toLocaleString();;
                                    var ownerid = userid;
                                    var cryptoname = tokenName;
                                    var txaddress = SenderAddress;
                                    var rxaddress = receiverAddress;
                                    var value = assetAmount;
                                    var netfee = TokenCfg.sendcfg.netfee;
                                    var contract = resContract;
                                    var txhash = res.transactionHash;
                                    var transactiondata = res;
                                    var massage = "";
                                    DBresp.data.insertTransac(datetime, ownerid, cryptoname, txaddress, rxaddress,
                                        value, netfee, contract, txhash, transactiondata, massage,
                                        function(err, tsac_res) {
                                            if (err) { console.log(" Insert transecton Error : " + err); return false };

                                        });
                                    // TXTdata.sendsuccess.  "transac_asset_res" : txhash  } );
                                    var send_resp = {
                                        "transac_asset_res": " TxID : <a href=http://" +
                                            config.ExpolrerSvr.ip + ":" + config.ExpolrerSvr.port + "/tx/" +
                                            txhash + ">" + txhash + "</a>",
                                        "ERROR": '<div class="col" >  </div>',
                                        "opsition": "assetsend",
                                        "item": -1,
                                        "send_div": '<div class="col" >  </div>',
                                    };
                                    // console.log (  res_txt ) ;
                                    //console.log("Response web " + JSON.stringify(send_resp));
                                    if (firswebsendflag) {
                                        console.log("info [WEB SEND RESPONSE flag reset ]");
                                        firswebsendflag = 0;
                                        web_res.send(send_resp);
                                        return true;
                                    }
                                } else if (err) {

                                    // console.log("Send tokens error ====> " + err);
                                    if (firswebsendflag) {
                                        console.log("info [WEB SEND ERROR flag reset ]" + err);
                                        firswebsendflag = 0;
                                        TXTdata.err_resp.transac_asset_res = err;
                                        web_res.send(TXTdata.err_resp);
                                        return false;
                                    }
                                };
                            },
                            function(be_error_err, be_error_res) {
                                if (be_error_err) {
                                    console.log("INFO [Another error response : #ASSETSEND V2 #1 " + be_error_err);
                                } else {
                                    console.log("INFO [Another error response : #ASSETSEND V2 #2 " + be_error_res);
                                }
                            }
                        );

                        /* // V1 
                        coinFunc.coinbase.SignedSendAsset( // do hard function
                            SenderAddress,
                            receiverAddress,
                            resContract,
                            resCryptKey,
                            txAssetValue,
                            function(err, res) {
                                var firswebsendflag = 1;
                                console.log("info [WEB SEND RESPONSE flag SET ]") ;
                                if (res) {
                                    // console.log(" Coin OUTPUT : \n\n\n\n\n" + "DONE ! TXiD  " + JSON.stringify(res, null, '\t'));
                                    var datetime = new Date(Date.now()).toLocaleString();;
                                    var ownerid = userid;
                                    var cryptoname = tokenName;
                                    var txaddress = SenderAddress;
                                    var rxaddress = receiverAddress;
                                    var value = assetAmount;
                                    var netfee = TokenCfg.sendcfg.netfee;
                                    var contract = resContract;
                                    var txhash = res.transactionHash;
                                    var transactiondata = res;
                                    var massage = "";
                                    DBresp.data.insertTransac(datetime, ownerid, cryptoname, txaddress, rxaddress,
                                        value, netfee, contract, txhash, transactiondata, massage,
                                        function(err, tsac_res) {
                                            if (err) { console.log(" Insert transecton Error : " + err); return false };

                                        });
                                    // TXTdata.sendsuccess.  "transac_asset_res" : txhash  } );
                                    var send_resp = {
                                        "transac_asset_res": " TxID : <a href=http://" +
                                            config.ExpolrerSvr.ip + ":" + config.ExpolrerSvr.port + "/tx/" +
                                            txhash + ">" + txhash + "</a>",
                                        "ERROR": '<div class="col" >  </div>',
                                        "opsition": "assetsend",
                                        "item": -1,
                                        "send_div": '<div class="col" >  </div>',
                                    };
                                    // console.log (  res_txt ) ;
                                    //console.log("Response web " + JSON.stringify(send_resp));
                                    if (firswebsendflag) {
                                        console.log("info [WEB SEND RESPONSE flag reset ]") ; 
                                        firswebsendflag = 0;
                                        web_res.send(send_resp);
                                        return true;
                                    }
                                } else if (err) {

                                    // console.log("Send tokens error ====> " + err);
                                    if (firswebsendflag) {
                                        console.log("info [WEB SEND ERROR flag reset ]" + err) ; 
                                        firswebsendflag = 0;
                                        TXTdata.err_resp.transac_asset_res = err;
                                        web_res.send(TXTdata.err_resp);
                                        return false;
                                    }
                                };
                            }); 

                        */ // V1 

                    }) // END if  in PairsendTokens
            } else {;
                web_res.send(TXTdata.wrong_resp);
                return false;
            } // END Check balance
            // web_res.send( jdata  );
        }); /// End chk password

    }); /// 2FA 
    return;
});

webserver.get('/assets', (req, WEBres) => {
    //var user  = req.query.userlogin.trim() ;
    var crypt = req.query.cryptid;
    if (crypt == null) {
        WEBres.sendFile(__dirname + '/prihtml/asset.html');
        //    WEBres.send("Hello world : " + JSON.stringify(req.session) );
    } else {
        WEBres.send("Just nothing ");
    }

}) // END

webserver.get('/transactions', (req, WEBres) => {
    if (!req.session.authenticated) {
        WEBres.send(TXTdata.aslogin);
        return;
    };
    var txt = "";
    // console.log ( JSON.stringify(  req.query , null , '\t' )  ) ;
    var userid = req.session.userid;
    //console.log("USERID IS " + userid);
    DBresp.data.findTransactions(userid, function(err, tran_res) {
        if (err) return false;
        //   console.log ( " TRANSACTIONS " + JSON.stringify( tran_res , null , '\t' )  ) ;
        txt += TXTdata.TsacHeadHover;
        for (x in tran_res) {
            txt += ("<tr>" +
                "<td>" + tran_res[x].datetime + "</td>" +
                "<td>" + tran_res[x].cryptoname + "</td>" +
                "<td>" + tran_res[x].rxaddress + "</td>" +
                "<td>" + tran_res[x].value + "</td>" +
                "<td>" + '<a href="http://' +
                config.ExpolrerSvr.ip +
                ":" + config.ExpolrerSvr.port + "/tx/" + tran_res[x].txhash + '" >' +
                tran_res[x].txhash + "</a></td>" +
                "</tr>");
        }
        txt += TXTdata.TsacEndHover;

        WEBres.send(txt);
        return;
    }); //

}) // END


webserver.get('/redirects', function(req, resp) {
    if (session.id) {
        resp.redirect('/admin');
        //    console.log("Redirected with: " + session.id);
    } else {
        resp.send("Who are  you  ");
    } //
});
webserver.get('/dextransfer', (req, WEBres) => {
    if (!req.session.authenticated) {
        WEBres.send({
            "ERROR": "Re Login again <a href='/account'   > Login </a> ",
            "coin_address": "0x0",
            "item": -1,
            "res_div": '<div class="col" > </div>'
        });
        return
    };
    //console.log(" RES DATA + 2FA " + JSON.stringify(req.query, null, '\t'));
    var pointer = req.query.pointer;
    var tx_amonut = req.query.amount;
    var rx_address = req.query.receiverAddress.trim();
    var sender_address = req.query.senderAddress.trim();
    var sender_pass = req.query.sendparse;
    var ADD_CHK_RES = '';
    var userid = req.session.userid;
    var coInput2FA = req.query.coInput2FA;
    // console.log("Pointer = " + pointer);
    //console.log ( "  CHECK Valid address : " + web3.utils.isAddress( rx_address  )  );

    if (!web3.utils.isAddress(sender_address)) { // GATE if not pass this have to go back
        ADD_CHK_RES = "Sender Address invalid International Bank Account Nunmber (IBAN) checksum please check address again";
        //   console.log("Sender Address invalid International Bank Account Nunmber (IBAN) checksum ");
    }
    if (!web3.utils.isAddress(rx_address)) { // GATE if not pass this have to go back
        ADD_CHK_RES = ADD_CHK_RES + "<br>Receiver Address invalid International Bank Account Nunmber (IBAN) checksum please check address again";
        //  console.log(" RX Address invalid International Bank Account Nunmber (IBAN) checksum ");
    }
    if (ADD_CHK_RES != '') {
        WEBres.send({ "co_addr_res": ADD_CHK_RES });
        return false;
    }

    //  console.log('type of VALUE_ETH  ' + typeof VALUE_ETH + " Address :" + rx_address);
    //  console.log('Amount is : ' + tx_amonut + " Address :" + rx_address);
    DBresp.data.idChkPass(userid, function(err, chkres) {
        // console.log(JSON.stringify(chkres, null, '\t'))
        if (chkres.answer.password != sender_pass) {
            WEBres.send({ "co_addr_res": '<h4 style="color:red;"> password failed </h4> ' });
            return false;
        } else if (chkres.answer.password === sender_pass) {
            DBresp.data.PairChkCoins(userid, sender_address,
                function(err, tokenDatas) {


                    DBresp.data.findTwoFA(userid, function(err, TFAdata) {
                        var valided = otp.twoFA.verify(TFAdata.twoFA, coInput2FA);
                        if (valided == false) { WEBres.send({ "co_addr_res": '<h4 style="color:red;"> 2FA  failed </h4> ' }); return false };
                        coinFunc.coinbase.SignedSendCoin(sender_address,
                            rx_address,
                            tokenDatas[0].cryptkey,
                            tx_amonut,
                            function(err, Cres) {
                                // if (Cres) console.log(" Send OUTPUT : ===>  " + JSON.stringify(Cres, null, '\t'));
                                if (Cres) {
                                    var txhash = Cres.transactionHash; //
                                    //console.log("ooooooooooooooo>>>>" + txhash);
                                    WEBres.send({
                                        "co_addr_res": "Transaction " + " TxID : <a href=http://" +
                                            config.ExpolrerSvr.ip + ":" + config.ExpolrerSvr.port + "/tx/" +
                                            txhash + ">" + txhash + "</a>"
                                    });
                                    // console.log(" CHK COIN NAME " + JSON.stringify(tokenDatas, null, '\t'));
                                    var datetime = new Date(Date.now()).toLocaleString();;
                                    var ownerid = req.session.userid;
                                    var cryptoname = tokenDatas[0].coinName;
                                    var txaddress = sender_address;
                                    var rxaddress = rx_address;
                                    var value = tx_amonut; //
                                    var netfee = TokenCfg.sendcfg.netfee;
                                    var contract = ""; //
                                    var txhash = Cres.transactionHash; //
                                    var transactiondata = Cres; //
                                    var massage = ""; //
                                    DBresp.data.insertTransac(datetime, ownerid, cryptoname, txaddress, rxaddress,
                                        value, netfee, contract, txhash, transactiondata, massage,
                                        function(err, tsac_res) {
                                            if (err) { console.log(" Insert transecton Error : " + err); return false };
                                        });

                                } else {
                                    WEBres.send({ "co_addr_res": " Send Error " + err });
                                    return false;
                                };
                            });
                    }); // 2 FA CHECK  
                }); // Chek PRi 
        } // 
    })
}); // END route 

webserver.get('*', function(req, res) {
    res.setHeader('content-type', 'application/txt');
    res.status(404).send("What !!")
});

var ser_var = webserver.listen(port);
console.log("open web  http://" + ser_var.address().address + ":" + port);
console.log("CTRL+C to Exit")