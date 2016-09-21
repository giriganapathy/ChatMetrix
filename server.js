/*-----------------------------------------------------------------------------
author: giri ganapathy
-----------------------------------------------------------------------------*/
var builder = require("botbuilder");
var restify = require("restify");
var tc = require("./tc-integration");
// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = process.env.model || "https://api.projectoxford.ai/luis/v1/application?id=f43fa0b5-85ec-466e-b8e7-773a0d3afb4a&subscription-key=b27a7109bc1046fb9cc7cfa874e3f819&q=";
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
//var connector = new builder.ConsoleConnector().listen();
var connector = new builder.ChatConnector({
    "appId": process.env.MICROSOFT_APP_ID,
    "appPassword": process.env.MICROSOFT_APP_PASSWORD
});
//Setting up Restify Server.
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});
server.post("/api/messages", connector.listen());
var bot = new builder.UniversalBot(connector);
bot.dialog('/', dialog);
bot.use(builder.Middleware.firstRun({ version: 1.0, dialogId: '*:/firstRun' }));
dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. Ask something about engagement/chat status to help you!"));
bot.dialog('/firstRun', [
    function (session) {
        session.userData.chatSessionCreated = true;
        tc.createSession(function (err, data) {
            if (null != err) {
                session.send("Session Creation Failed..." + err.description);
            }
            else {
                if (null == data || data["result"] == false) {
                    session.send("Session Creation Failed...Reason: Unknown");
                }
                else if(true == data["result"]) {
                    session.send("Session Created Successfully! - Cookie Info:" + data["cookie-info"]);
                }
            }
        });
    }
]);
dialog.matches('intent.engagement.summary', [
    function (session, args, next) {
        // Resolve and store any entities passed from LUIS.
        var entity = builder.EntityRecognizer.findEntity(args.entities, 'category');
        if (null != entity && null != entity.entity) {
            tc.chatSummary(function (errInfo, dataInfo) {
                if (null != errInfo) {
                    session.send(errInfo.message);
                }
                else {
                    session.send(JSON.stringify(dataInfo));
                }
            });
        }
        else {
            session.send("I'm sorry I didn't understand. Try again");
        }
    }
]);
/*bot.dialog("/", function (session) {
    if (null == session.userData.chatSessionCreated || false == session.userData.chatSessionCreated) {
        session.userData.chatSessionCreated = true;
        tc.createSession(function (err, data) {
            if (null != err) {
                console.log("Session Creation Failed..." + err.description);
            }
            else {
                if (null == data || data["result"] == false) {
                    console.log("Session Creation Failed...Reason: Unknown");
                }
                else {
                    console.log("Session Created Successfully...");
                    tc.chatSummary(function (errInfo, dataInfo) {
                        if (null != errInfo) {
                            console.log(errInfo.message);
                        }
                        else {
                            console.log(dataInfo);
                        }
                    });
                }
            }
        });
    }
    else {
        if (session.message.text == "Bye") {
            session.userData.chatSessionCreated = false;
            delete session.userData.chatSessionCreated;
            tc.destroySession(function (err, data) {
                if (null != err) {
                    console.log("Session Destroy Failed..." + err.description);
                }
                else {
                    console.log("Session Destroyed...");
                }
            });
            session.endDialog();
        }
        else {
            tc.chatSummary(function (errInfo, dataInfo) {
                if (null != errInfo) {
                    console.log(errInfo.message);
                }
                else {
                    console.log(dataInfo);
                }
            });
        }
    }
});*/
//# sourceMappingURL=server.js.map
