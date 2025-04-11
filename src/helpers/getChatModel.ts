import * as vscode from "vscode";

/**
 * Extracts the model name from the picker, otherwise uses the default model.
 *
 * @param request - The chat request object.
 * @param command - The command string which may or may not end with '-with-model'.
 * @param userPrompt - The user-provided prompt string.
 * @returns A tuple where the first element is the model name and the second element is the modified prompt.
 *
 */
export function getModelFamily(request: vscode.ChatRequest): string {
  if (request.model) {
      return request.model.family;
  } else {
      // This should only happen on old vscode versions that didn't 
      // supported the picker yet
      return 'gpt-4o-mini';
  }
}

/**
 * Retrieves a chat model by its family name from the available Copilot chat models.
 *
 * @param family - The family name of the chat model to retrieve.
 * @returns A promise that resolves to the chat model matching the specified family name.
 * @throws An error if the specified model family is not found, including a list of available models.
 */
export async function getChatModelByName(family: string): Promise<vscode.LanguageModelChat> {
    const chatModels = await vscode.lm.selectChatModels({ vendor: 'copilot' });

    const model = chatModels.find(model => model.family.toLowerCase() === family.toLowerCase());

    if (!model) {
        // throw error and include the list of available models
        throw new Error(`Model **${family}** not found. \n\nAvailable Copilot Models\n\n${chatModels.map(model => `- ${model.family} ${model.version} `).join('\n')} `);
    }

    return model;
}