"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
(function () {
    // new PolyLog("YYYY-MM-DD HH:MM:SS");
    _1.PolyLog.Init("YYYY-MM-DD HH:MM:SS");
    _1.PolyLog.Log({ service: "TESTSERV", message: "TEST" });
    _1.PolyLog.Error("ERR");
    _1.PolyLog.Warn("WARN");
    _1.PolyLog.Info("INFO");
})();
