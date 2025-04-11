import * as vscode from "vscode";
import { addReferencesToResponse } from "./references";
import { listAvailableCopilotModels } from "./helpers/listCopilotModels";
import { getUserPrompt } from "./helpers/getUserPrompt";

export async function handleParrotChatHandler(
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  response: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void | vscode.ChatResult | null | undefined> {
  const command = request.command;

  response.progress("Looking at something to parrot...");

  const { userPrompt, references } = await getUserPrompt(request);

  addReferencesToResponse(request, response, references);

  switch (command) {
    case "listmodels":
      return await listAvailableCopilotModels(response);
    case "likeapirate":
    case "likeyoda":
      const messages = [
        generateSystemPrompt(command),
        vscode.LanguageModelChatMessage.User(userPrompt),
      ];

      const [chatModel] = await vscode.lm.selectChatModels({
        vendor: "copilot",
        family: "gpt-4o-mini",
      });

      const ChatResponse = await chatModel.sendRequest(messages, {}, token);

      for await (const responseText of ChatResponse.text) {
        response.markdown(responseText);
      }

      break;
    default:
      response.markdown(userPrompt);
      break;
  }
}

function generateSystemPrompt(
  command: string | undefined
): vscode.LanguageModelChatMessage {
  let soundLike: string = "";
  if (command?.search("pirate") !== -1) {
    soundLike = "pirate ";
  } else if (command?.search("yoda") !== -1) {
    soundLike = "yoda ";
  }

  return vscode.LanguageModelChatMessage.User(
    `Repeat what I will say below, but make it sound like a coding ${soundLike}parrot. Return the text in plaintext`
  );
}
