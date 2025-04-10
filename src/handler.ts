import * as vscode from "vscode";

export async function handleParrotChatHandler(
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  response: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void | vscode.ChatResult | null | undefined> {
  const command = request.command;
  response.progress("Looking at something to parrot...");

  switch (command) {
    case "likeapirate":
    case "likeyoda":
      const messages = [
        generateSystemPrompt(command),
        vscode.LanguageModelChatMessage.User(request.prompt),
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
      response.markdown(request.prompt);
      break;
  }
}

function addReferencesToResponse(
  request: vscode.ChatRequest,
  response: vscode.ChatResponseStream
) {
  const command = request.command;

  // Nonsense reference just for demo purposes. It's not really a reference to the user's input
  response.reference(vscode.Uri.parse("https://www.google.com"));

  // Like yoda add yoda reference if talking.  Yes, hmmm.
  if (command === "likeyoda") {
    response.reference(vscode.Uri.parse("https://en.wikipedia.org/wiki/Yoda"));
  }
  // add a reference if blabberin' on like a pirate
  if (command === "likeapirate") {
    response.reference(
      vscode.Uri.parse(
        "https://en.wikipedia.org/wiki/International_Talk_Like_a_Pirate_Day"
      )
    );
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
