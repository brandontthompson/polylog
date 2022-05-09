import { PolyLog } from ".";

(() => {
    // new PolyLog("YYYY-MM-DD HH:MM:SS");
    PolyLog.Init("YYYY-MM-DD HH:MM:SS");
    PolyLog.Log({service:"TESTSERV", message:"TEST"});
    PolyLog.Error("ERR");
    PolyLog.Warn("WARN");
    PolyLog.Info("INFO");
})();