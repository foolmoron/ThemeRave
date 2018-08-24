'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log("Let's get this party started!!");

    const ALL_INSTALLED_THEMES = vscode.extensions.all
        .filter(ext => ext.packageJSON.contributes.themes)
        .map(ext => ext.packageJSON.contributes.themes[0])
        .map(theme => theme.id || theme.label)
        ;

    const onActive = vscode.commands.registerCommand('extension.enableRave', () => {
        let prevTheme = '';
        vscode.workspace.onDidChangeTextDocument(e => {
            // ignore change events that don't actually have changes (why does this even happen?)
            if (e.contentChanges.length === 0) {
                return;
            }
            // ignore the event that fires when the settings file gets changed (also why???)
            if (e.document.uri.path.indexOf("/Code/") >= 0 && e.document.uri.path.endsWith('settings.json')) {
                return;
            }
            // pick random theme
            var rand = Math.floor(Math.random() * ALL_INSTALLED_THEMES.length);
            // if it's the same theme, choose the next one instead so it's always a new theme
            if (ALL_INSTALLED_THEMES[rand] === prevTheme) {
                rand = (rand + 1) % ALL_INSTALLED_THEMES.length;
            }
            // remember previous theme
            const newTheme = ALL_INSTALLED_THEMES[rand];
            prevTheme = newTheme;
            // update config
            vscode.workspace.getConfiguration().update('workbench.colorTheme', newTheme, true);
        }, null, context.subscriptions);
    });

    context.subscriptions.push(onActive);
}

export function deactivate() {
}