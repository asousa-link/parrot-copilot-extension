import * as vscode from "vscode";

export async function listAvailableCopilotModels(response: vscode.ChatResponseStream): Promise<void> {
  const chatModels = await vscode.lm.selectChatModels({vendor: "copilot" });

  response.markdown("Available copilot models\n");
  chatModels.forEach(m => {
    response.markdown(`- ${m.name} (${m.family} ${m.version})\n`);
  });
}