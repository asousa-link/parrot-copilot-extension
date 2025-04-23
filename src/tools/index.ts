import * as vscode from 'vscode';
import { TabCountTool } from './tabCountTool';

export function registerChatTools(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.lm.registerTool('asousa-parrot_tabCount', new TabCountTool()));
}