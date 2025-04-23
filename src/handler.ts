import * as vscode from "vscode";
import { addReferencesToResponse } from "./references";
import { listAvailableCopilotModels } from "./helpers/listCopilotModels";
import { getUserPrompt } from "./helpers/getUserPrompt";
import { getModelFamily, getChatModelByName } from "./helpers/getChatModel";

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

      const chatModel = await getChatModelByName(getModelFamily(request));

      const ChatResponse = await chatModel.sendRequest(messages, {}, token);

      for await (const responseText of ChatResponse.text) {
        response.markdown(responseText);
      }

      break;
    case "countTabs":
      // Parse tab group from prompt if needed
      const tabGroupMatch = request.prompt.match(/tabGroup[:\s]+(\d+)/i);
      const tabGroup = tabGroupMatch ? parseInt(tabGroupMatch[1]) : undefined;

      await handleToolCall(
        response,
        "asousa-parrot_tabCount",
        { tabGroup },
        token,
        request.toolInvocationToken // Pass the token from the request
      );
      break;
    default:
      response.markdown(userPrompt);
      break;
  }
}

async function handleToolCall(
  response: vscode.ChatResponseStream,
  toolName: string,
  params: any,
  token: vscode.CancellationToken,
  toolInvocationToken: vscode.ChatParticipantToolToken
) {
  try {
    const toolResult = await vscode.lm.invokeTool(
      toolName,
      { input: params, toolInvocationToken },
      token
    );

    for (const part of toolResult.content) {
      if (part instanceof vscode.LanguageModelTextPart) {
        response.markdown(part.value);
      }
    }
  } catch (error) {
    response.markdown(`Failed to invoke tool: ${error}`);
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
