import { ChatRequestHandler } from "vscode";

export const handler : ChatRequestHandler = (request, context, response, token) => {
  response.markdown(request.prompt);
};