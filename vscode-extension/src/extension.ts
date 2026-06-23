import * as vscode from 'vscode';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('IconSearch Integration Extension is now active.');

  const sidebarProvider = new SidebarProvider(context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'iconsearch.sidebar',
      sidebarProvider,
      { webviewOptions: { retainContextWhenHidden: true } }
    )
  );

  let disposable = vscode.commands.registerCommand('iconsearch-integration.search', async () => {
    vscode.commands.executeCommand('iconsearch.sidebar.focus');
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
