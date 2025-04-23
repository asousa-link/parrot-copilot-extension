import * as vscode from 'vscode';

export function handleFeedback(feedback: vscode.ChatResultFeedback) {
    console.log('Feedback received:', feedback);

    switch (feedback.kind) {
        case vscode.ChatResultFeedbackKind.Helpful:
            vscode.window.showInformationMessage('🚀 Happy that you liked it.');
            break;
        case vscode.ChatResultFeedbackKind.Unhelpful:
            vscode.window.showWarningMessage('😢 Sorry that you didn\'t like our response.');
            break;
        default:
            vscode.window.showInformationMessage('Don\'t know what to do with this feedback type.');
            break;
    }
}