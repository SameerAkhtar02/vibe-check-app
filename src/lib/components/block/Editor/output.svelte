<script>
  import { EditorView, highlightSpecialChars, lineNumbers } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { javascript } from '@codemirror/lang-javascript';
  import { keymap } from '@codemirror/view';
  import { defaultKeymap } from '@codemirror/commands';
  import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { defaultHighlightStyle } from '@codemirror/highlight';
import errorLinePlugin from '../../../../errorPlugin/errorPlugin'
import { highlightActiveLine } from '@codemirror/view';
import { Compartment } from '@codemirror/state';


import { onMount } from 'svelte';

  let {value, errors} = $props()

  let editorDiv;
  let editorView;
  let placeholder = '//write your code here'
  const errorCompartment = new Compartment();

  const baseExtensions = [
    lineNumbers(),
    javascript(),
    highlightActiveLine(),
    keymap.of(defaultKeymap),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        value = newValue;
      }
    }),
    EditorView.theme({
      '&': {
        backgroundColor: '#fff',
        color: '#262626',
        fontFamily: 'monospace',
        padding: '12px',
        fontSize: '14px',
        height : '100%',
        
      },
      '.cm-gutters': {
        backgroundColor: '#e2e8f0',
        color: '#90a1b9',
        borderRight: '1px solid #444',
      },
      '.cm-placeholder': {
        color: '#000'
      }
    }),
    EditorView.editable.of(true)
  ];
  
 const getError = (errors)=> [
    errorLinePlugin(errors),  
    EditorView.theme({
        '.cm-error-line': {
          backgroundColor: '#e7000b',
          color : "#fff",
          borderLeft: '3px solid #ff4d4f',
        },
        '.cm-activeLine': {
        backgroundColor: 'bg-blue-200', // subtle VSCode-like glow
        color : '#000'
      }
      })
  ]


   onMount(() => {
    console.log($state.snapshot(errors))
    const state = EditorState.create({
      doc: value,
      extensions: [...baseExtensions, errorCompartment.of(getError(errors ?? []))]
    });

    editorView = new EditorView({
      state,
      parent: editorDiv
    });

    // Set placeholder manually
    if (!value) {
      editorView.dom.setAttribute('placeholder', placeholder);
    }
  });

  $effect(()=>{
    if(editorView && errors){
      console.log('hu')
      editorView.dispatch({
    effects: errorCompartment.reconfigure(getError(errors))
  });
    }
  })
</script>


<div bind:this={editorDiv} class="w-full h-full overflow-auto text-neutral-700" ></div>