export function draftHTMLRenderer(editorState) {

  const convertInlineStyle = (tree, block) => {

    const parsedInline = tree.map(function(leafSet) {

      const leaves = leafSet.get('leaves');

      const parsedLeaves = leaves.map(function(leaf) {

        const text = block.getText();
        const start = leaf.get('start');
        const end = leaf.get('end');
        const style = block.getInlineStyleAt(start).toJS().join("_");

        switch (style) {

          case "BOLD":
            return "<b>" + text.slice(start, end) + "</b>";

          case "ITALIC":
            return "<i>" + text.slice(start, end) + "</i>";

          case "UNDERLINE":
            return "<u>" + text.slice(start, end) + "</u>";

          case "BOLD_ITALIC":
            return "<b><i>" + text.slice(start, end) + "</b></i>";

          case "BOLD_UNDERLINE":
            return "<b><u>" + text.slice(start, end) + "</b></u>";

          case "ITALIC_UNDERLINE":
            return "<i><u>" + text.slice(start, end) + "</i></u>";

          case "BOLD_ITALIC_UNDERLINE":
            return "<b><i><u>" + text.slice(start, end) + "</b></i></u>";

          default:
            return text.slice(start, end);
        }

      });

      return parsedLeaves.join("");

    });

    return parsedInline.join("");

  }

  const content = editorState.getCurrentContent();
  const blocksArray = content.getBlocksAsArray();
  let listOpen = false;

  const parsedText = blocksArray.map(function(block, index) {

    const text = block.getText();
    const tree = editorState.getBlockTree(block.getKey());

    switch (block.type) {

      case 'unstyled':
        return "<p>" + convertInlineStyle(tree, block) + "</p>";

      case 'header-one':
        return "<h1>" + convertInlineStyle(tree, block) + "</h1>"

      case 'unordered-list-item':

        console.log(listOpen);

        if (listOpen) {
          if (blocksArray[index + 1] && blocksArray[index + 1].getType() == "unordered-list-item") {
            listOpen = true;
            return "<li>" + convertInlineStyle(tree, block) + "</li>";
          } else {
            listOpen = false;
            return "<li>" + convertInlineStyle(tree, block) + "</li></ul>";
          }
        }

        if (!listOpen) {
          if (blocksArray[index + 1] && blocksArray[index + 1].getType() == "unordered-list-item") {
            listOpen = true;
            return "<ul><li>" + convertInlineStyle(tree, block) + "</li>";
          } else {
            listOpen = false;
            return "<ul><li>" + convertInlineStyle(tree, block) + "</li></ul>";
          }
        }

      default:
        return block.text;
    }

  });

  return parsedText.join("");

}
