import * as vscode from "vscode";

export function addReferencesToResponse(
  request: vscode.ChatRequest,
  response: vscode.ChatResponseStream,
  references: (vscode.Location | vscode.Uri)[]
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

  for (const ref of references) {
    response.reference(ref);
  }
}

/**
 * Retrieves the current selection location in the active text editor.
 *
 * @returns {vscode.Location | null} The location of the current selection in the active text editor,
 * or null if there is no active text editor.
 */
function getCurrentSelectionLocation(): vscode.Location | null {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    return new vscode.Location(editor.document.uri, editor.selection);
  }

  return null;
}
