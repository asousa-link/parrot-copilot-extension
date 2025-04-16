import * as vscode from 'vscode';

const likeFeedbackList = [
  "How can I write my own VS Code extension?",
  "I love VS Code",
  "I Love Github Copilot",
  "Github Copilot Extensions are cool"
];

export function generateFollowups(): vscode.ChatFollowup[] | undefined {
  const randomPrompt = likeFeedbackList[Math.floor(Math.random() * likeFeedbackList.length)];

  const followups: vscode.ChatFollowup[] = [
    {
      label: `Parrot "${randomPrompt}"`,
      prompt: randomPrompt,
      command: ""
    },
    {
      label: `Parrot "${randomPrompt}" like Yoda`,
      prompt: randomPrompt,
      command: "likeyoda"
    },
    {
      label: `Parrot "${randomPrompt}" like a pirate`,
      prompt: randomPrompt,
      command: "likeapirate"
    }
  ];

  return followups;
}