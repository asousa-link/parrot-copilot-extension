import * as vscode from "vscode";

export async function getUserPrompt(
  request: vscode.ChatRequest
): Promise<{
  userPrompt: string;
  references: (vscode.Location | vscode.Uri)[];
}> {
  let userPrompt = request.prompt.trim();
  let references: (vscode.Location | vscode.Uri)[] = [];

  async function processDocumentReference(
    location: vscode.Location,
    refName: string,
    append = false
  ): Promise<string> {
    let document = vscode.workspace.textDocuments.find(
      (doc) => doc.uri.toString() === location.uri.toString()
    );

    // If document is no longer open, then ignore it.
    if (!document) {
      return userPrompt;
    }
    const text = document.getText(location.range);

            
    references.push(location);
        
    if (append) {
        return userPrompt + " " + text;
    } else {
        return userPrompt.replaceAll(`#${refName}`, text);
    }
  }


  for (const ref of request.references) {
    const ref_any = ref as any;
    console.debug("*[REF]:", ref);
    console.debug("*[any]:", ref_any);
    console.log(`processing ${ref.id} with name: ${ref_any.name}`);

    if (ref.id === "copilot.selection") {
      const currentSelection = getCurrentSelectionText();
      console.log(`current selection: ${currentSelection}`);

      if (currentSelection) {
        userPrompt = userPrompt.replaceAll(
          `#${ref_any.name}`,
          currentSelection
        );
      }

      const location = getCurrentSelectionLocation();
      if (location) {
        references.push(location);
      }
    } else if (ref.id === "vscode.selection") {
      userPrompt = await processDocumentReference(ref.value as vscode.Location, ref_any.name);
    } else if (ref.id === "vscode.implicit.selection") {
      userPrompt = await processDocumentReference(ref.value as vscode.Location, ref_any.name, true);
    } else if (ref.id === "vscode.file") {
      console.log(`processing ${ref.id} with name: ${ref_any.name}`);
      const fileUri = ref.value as vscode.Uri;
      const fileContent = await vscode.workspace.fs.readFile(fileUri);
      
      userPrompt = userPrompt.replaceAll(`#${ref_any.name}`, fileContent.toString());
      references.push(fileUri);

    } else {
      console.log(`will ignore reference of type: ${ref.id}`);
    }
  }

  return {userPrompt, references};
}

/**
 * Retrieves the currently selected text in the active text editor.
 *
 * The selection is from the current active editor. If the user select and switches
 * to another tab we get nothing.
 *
 * The alternative is to parse the selected value from the reference value, but that's brittle.
 *
 * @returns {string | null} The selected text, or null if no editor is active.
 */
function getCurrentSelectionText(): string | null {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  return editor.document.getText(editor.selection);
}

/**
 * Retrieves the current selection location in the active text editor.
 *
 * @returns {vscode.Location | null} The location of the current selection in the active text editor,
 * or null if there is no active text editor.
 */
export function getCurrentSelectionLocation(): vscode.Location | vscode.Uri | null {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
      return new vscode.Location(editor.document.uri, editor.selection);
  }

  return null;
}
