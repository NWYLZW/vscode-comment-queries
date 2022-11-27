import * as vscode from "vscode";

export default function useInlayHintsFor(
  langs: string[],
  provideInlayHints: vscode.InlayHintsProvider['provideInlayHints'],
  opts: Omit<vscode.InlayHintsProvider, 'provideInlayHints'> = {},
) {
  return vscode.languages.registerInlayHintsProvider(
    langs.map(language => ({ language })),
    {
      provideInlayHints,
      ...opts
    }
  );
}