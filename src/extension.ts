import { exec } from 'child_process';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
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

	vscode.workspace.onDidSaveTextDocument((document: vscode.TextDocument) => {
		if (['jade', 'pug'].indexOf(document.languageId) >= 0) {
			extension.convertToHtml(document.fileName);
		}
	});
}

export function deactivate() { }


interface ExtConfig {
	pretty: {
		enable: boolean
	},
	additionalCommandLineParams?: string
}


class Pug2HtmlExt {
	private _outputChannel!: vscode.OutputChannel;
	private _context!: vscode.ExtensionContext;
	private _config!: ExtConfig;

	constructor(context: vscode.ExtensionContext) {
		this._context = context;
		this._outputChannel = vscode.window.createOutputChannel('Pug 2 Html');
		this.loadConfig();
	}

	public sendLog(message: string, hasError?: boolean) {
		if (hasError) {
			this._outputChannel.clear();
			this._outputChannel.show(true);
		}
		this._outputChannel.appendLine(message);
	}

	public get isEnabled(): boolean {
		return !!this._context.globalState.get('isEnabled', true);
	}

	public set isEnabled(value: boolean) {
		this._context.globalState.update('isEnabled', value);
		this.sendLog(`Convert Pug To HTML On Save ${this.isEnabled ? 'enabled' : 'disabled'}.`);
	}

	public convertToHtml(filePath: string) {
		let commandText = `pug "${filePath}"`;
		if (this._config.pretty.enable) {
			commandText += ` -P`;
		}
		let child = exec(commandText);
		if (child) {
			// child.stdout?.on('data', data => this.sendLog(data));
			child?.stderr?.on('data', data => this.sendLog(data, true));
			child.on('error', (e) => {
				this.sendLog(e.message, true);
			});
		} else {
			this.sendLog('child null', true);
		}
	}

	public loadConfig() {
		this._config = <ExtConfig>vscode.workspace.getConfiguration('pug2html').get('extension');
	}
}
