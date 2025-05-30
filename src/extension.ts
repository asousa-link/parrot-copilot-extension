// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { handleParrotChatHandler } from "./handler";
import { generateFollowups } from "./followup";
import { handleFeedback } from './helpers/feedbackHandler';
import { registerChatTools } from "./tools";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "asousa-copilot-chat-parrot" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "asousa-copilot-chat-parrot.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from Parrot!");
    }
  );

  context.subscriptions.push(disposable);

  const participant = vscode.chat.createChatParticipant(
    "asousa.copilot.parrot",
    handleParrotChatHandler
  );

  participant.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "images",
    "parrot.png"
  );

  participant.followupProvider = {
    provideFollowups: generateFollowups,
  };

  participant.onDidReceiveFeedback(handleFeedback);
  context.subscriptions.push(participant);

  registerChatTools(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
