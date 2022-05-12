import { appendFile, existsSync, writeFile } from "fs";

const fileRotation:string[] = []; 


export class PolyLog {
    public static service:string
    public static dateFormat:string
    public static fileExtension:string;
    public static writeFile:boolean
    public static FileRotateTime:number 
    public static maxFileSize:number

    constructor(service?:string, dateFormat?:string, writeFile?:boolean, logRotateTime?:number, maxLogSize?:number){
        PolyLog.dateFormat = dateFormat || "%Y-%D-%M %h:%m:%s";
        PolyLog.service = service || "PolyLog";
        PolyLog.fileExtension = ".log";
        PolyLog.writeFile = writeFile || false;
        PolyLog.FileRotateTime = logRotateTime || 86400;
        PolyLog.maxFileSize = maxLogSize || 50;
    }

    public static Log(message:any, loglevel?:LogLevel|undefined, writeNewFile?:boolean){
        const log:Log = isPolyLog(message) ? message : {service: PolyLog.service || "UNKNOWN", message:message}; 
        return PolyLog.Log3(log, loglevel ? loglevel : LogLevel.INFO, writeNewFile||false);   
    }
    
    public static Warn(message:any){
        PolyLog.Log(message, LogLevel.WARN);
    }
    
    public static Error(message:any){
        PolyLog.Log(message, LogLevel.ERROR);
    }
    
    public static Info(message:any){
        PolyLog.Log(message, LogLevel.INFO);
    }
    
    private static Log3(polylog:Log, logLevel:LogLevel, writeNewFile:boolean):LogFile | undefined | null{
        const caller = (logLevel == LogLevel.ERROR) ? ErrorTrace() : null;
        let message:string = "%t [%loglevel] %service - %trace %msg"
        message = message.replace("%t", PolyLog.FormatTime(this.dateFormat || "%Y-%M-%D_%h:%m:%s"))
        .replace("%loglevel", this.FormatString(logLevel, 6))
        .replace("%service", this.FormatString(polylog.service.toString(), polylog.service.length + 2))
        .replace("%trace", (caller) ? caller : "")
        .replace("%msg", polylog.message);
        // const message:string = PolyLog.FormatTime() + " " + " [ " + this.FormatString(logLevel, 6) + " ] " +this.FormatString(polylog.service.toString(), polylog.service.length + 2) + ((caller)? " - "+ caller + " " : "") + " | " + polylog.message
        PolyLog.Log0(message);
        if(writeNewFile) return PolyLog.WriteFile(message);
    }
    
    private static Log0(msg:string){
        console.log(msg);
    }
    
    private static FormatTime(format:string):string{
        const date:Date = new Date();

        return (format.replace("%Y", date.getFullYear().toString()).replace("%M", ("0"+(date.getMonth()+1)).slice(-2).toString()).replace("%D", ("0" + date.getDate()).slice(-2).toString()).replace("%h", date.getHours().toString()).replace("%m", date.getMinutes().toString()
        ).replace("%s", date.getSeconds().toString()).replace("%ms", date.getMilliseconds().toString()));
    }

    private static FormatString(str:string, len:number) {
        let formatted = "";
        const spacing = Math.ceil((len - str.length) / 2);

        for (let index = 0; index < len; index++) {
            const element = str[index];
            if(index < spacing || index >= spacing + str.length) formatted += " ";
            else formatted += str[index - spacing];
        }

        return formatted;

    }
    
    private static WriteFile(str:string, file?:string):LogFile{
    
        const fileName = this.FormatTime("YYYY-DD-MM_HH:MM:SS")+"-LOGFILE"+this.fileExtension;
        if(existsSync(fileName))
            appendFile(fileName, str, error);
        else
            writeFile(fileName, str, error);

        function error(error:any){
            if(error) PolyLog.Error("Failed to write to file" + error)
        }
    
        return {
            id: fileName,
            type: this.fileExtension,
            size:str.length,
            time: Date.now()
        }
    }
}

export enum LogLevel {
    NONE    = "",
    WARN    = "WARN",
    ERROR   = "ERROR",
    INFO    = "INFO"
}

export interface Log {
    service:string,
    message:any
}

type LogFile = {
    id:string;
    type:string;
    size:number;
    time:number;
}

function isPolyLog(obj:any): obj is Log{
    return obj?.service
}

function ErrorTrace(){
    let caller:string|null = null;
    let line:string = "";
    const error:Error = new Error();
    

    let trace = (error.stack)?.toString().split("\n") || [];

    for (let index = 0; index < 7; index++) {
        if(caller && !caller?.toString().includes("write")) break;
        const tra = trace[index].toString().trimStart().replace("at", "");
        
        line = ((tra.split("/").slice(-2)).toString()).slice(0, -1);
        caller = tra.split(" ", 2)[1];
        
        if(index > 7) {caller = null; break;}
        
    }
    if(caller) caller = caller +": "+ line;
    return caller;
}