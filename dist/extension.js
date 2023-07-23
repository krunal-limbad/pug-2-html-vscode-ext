/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("child_process");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const child_process_1 = __webpack_require__(2);
const vscode = __webpack_require__(1);
function activate(context) {
    let extension = new Pug2HtmlExt(context);
    vscode.commands.registerCommand('extension.pug2html.enablePug2HtmlOnSave', () => {
        extension.isEnabled = true;
    });
    vscode.commands.registerCommand('extension.pug2html.disablePug2HtmlOnSave', () => {
        extension.isEnabled = false;
    });
    vscode.workspace.onDidChangeConfiguration(() => {
        extension.loadConfig();
    });
    vscode.workspace.onDidSaveTextDocument((document) => {
        if (['jade', 'pug'].indexOf(document.languageId) >= 0) {
            extension.convertToHtml(document.fileName);
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
class Pug2HtmlExt {
    constructor(context) {
        this._context = context;
        this._outputChannel = vscode.window.createOutputChannel('Pug 2 Html');
        this.loadConfig();
    }
    sendLog(message, hasError) {
        if (hasError) {
            this._outputChannel.clear();
            this._outputChannel.show(true);
        }
        this._outputChannel.appendLine(message);
    }
    get isEnabled() {
        return !!this._context.globalState.get('isEnabled', true);
    }
    set isEnabled(value) {
        this._context.globalState.update('isEnabled', value);
        this.sendLog(`Convert Pug To HTML On Save ${this.isEnabled ? 'enabled' : 'disabled'}.`);
    }
    convertToHtml(filePath) {
        let commandText = `pug "${filePath}"`;
        if (this._config.pretty.enable) {
            commandText += ` -P`;
        }
        let child = (0, child_process_1.exec)(commandText);
        if (child) {
            // child.stdout?.on('data', data => this.sendLog(data));
            child?.stderr?.on('data', data => this.sendLog(data, true));
            child.on('error', (e) => {
                this.sendLog(e.message, true);
            });
        }
        else {
            this.sendLog('child null', true);
        }
    }
    loadConfig() {
        this._config = vscode.workspace.getConfiguration('pug2html').get('extension');
    }
}

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map