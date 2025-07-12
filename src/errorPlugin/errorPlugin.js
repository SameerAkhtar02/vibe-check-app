// import { ViewPlugin, Decoration } from '@codemirror/view';

// export default function errorLinePlugin(errors = []) {
//   return ViewPlugin.fromClass(
//     class {
//       constructor(view) {
//         this.decorations = this.buildDecorations(view);
//       }

//       update(update) {
//         if (update.docChanged || update.viewportChanged) {
//           this.decorations = this.buildDecorations(update.view);
//         }
//       }

//       buildDecorations(view) {
//         const builder = [];
//         for (const error of errors) {
//           for (const zeroBasedLineNum of error.lines) {
//             const line = view.state.doc.line(zeroBasedLineNum ); //ss
//             builder.push(
//               Decoration.line({
//                 attributes: { class: 'cm-error-line' }
//               }).range(line.from)
//             );
//           }
//         }
//         return Decoration.set(builder);
//       }
//     },
//     { decorations: v => v.decorations }
//   );
// }


import { ViewPlugin, Decoration } from '@codemirror/view';

export default function errorLinePlugin(errors = []) {
  return ViewPlugin.fromClass(
    class {
      constructor(view) {
        const { decorations } = this.buildDecorations(view);
        this.decorations = decorations;
      }

      update(update) {
        if (update.docChanged || update.viewportChanged) {
          const { decorations } = this.buildDecorations(update.view);
          this.decorations = decorations;
        }
      }

      buildDecorations(view) {
  const builder = [];
  const formattedErrors = [];

  for (const error of errors) {
    if (typeof error.line !== 'number') continue;

    const line = view.state.doc.line(error.line); // `line` is 1-based

    builder.push(
      Decoration.line({
        attributes: { class: 'cm-error-line' }
      }).range(line.from)
    );

    formattedErrors.push({
      ...error,
      line: error.line
    });
  }

        // Optionally log or export `formattedErrors` somewhere if needed
        console.log('Formatted Errors:', formattedErrors);

        return {
          decorations: Decoration.set(builder),
          formattedErrors
        };
      }
    },
    {
      decorations: v => v.decorations
    }
  );
}
