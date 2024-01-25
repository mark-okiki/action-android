"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = exports.execIgnoreFailure = void 0;
const exec_1 = require("@actions/exec");
function execWithResult(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = new Result();
        let commands = commandLine.replace(/&& \\\n/m, '&& ').split("\n");
        for (const command of commands) {
            let exitCode = yield (0, exec_1.exec)('bash', ['-c', command], options);
            result.stdout += result.stdout.trim();
            result.stderr += result.stderr.trim();
            result.exitCode = exitCode;
            if (exitCode !== 0) {
                // If a command fails, break the loop and return the result
                break;
            }
        }
        return result;
    });
}
exports.default = execWithResult;
function execIgnoreFailure(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield execWithResult(commandLine, args, options);
        return result.stdout;
    });
}
exports.execIgnoreFailure = execIgnoreFailure;
class Result {
    constructor() {
        this.exitCode = 0;
        this.stdout = '';
        this.stderr = '';
    }
}
exports.Result = Result;
