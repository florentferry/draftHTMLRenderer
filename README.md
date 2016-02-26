## How to use

In your component which use `DraftJS`.

```
import { draftHTMLRenderer } from '../draftHTMLRenderer';

export default class MyEditor extends React.component {

  onSave(editorState) {
    const parsedHTML = draftHTMLRenderer(editorState);
    // Store your parsedHTML
  }
}
```
