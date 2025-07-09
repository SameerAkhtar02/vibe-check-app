import { ViewPlugin, Decoration } from '@codemirror/view';

export default function errorLinePlugin(errors = []) {
  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        this.decorations = this.buildDecorations(view);
      }

      update(update) {
        if (update.docChanged || update.viewportChanged) {
          this.decorations = this.buildDecorations(update.view);
        }
      }

      buildDecorations(view) {
        const builder = [];
        for (const error of errors) {
          for (const lineNum of error.lines) {
            const line = view.state.doc.line(lineNum);
            builder.push(
              Decoration.line({
                attributes: { class: 'cm-error-line' }
              }).range(line.from)
            );
          }
        }
        return Decoration.set(builder);
      }
    },
    { decorations: v => v.decorations }
  );
}
