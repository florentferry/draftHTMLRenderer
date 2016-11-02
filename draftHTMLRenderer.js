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
            return "<strong>" + text.slice(start, end) + "</strong>";

          case "ITALIC":
            return "<em>" + text.slice(start, end) + "</em>";

          case "UNDERLINE":
            return "<u>" + text.slice(start, end) + "</u>";

          case "BOLD_ITALIC":
            return "<strong><em>" + text.slice(start, end) + "</strong></em>";

          case "BOLD_UNDERLINE":
            return "<strong><u>" + text.slice(start, end) + "</strong></u>";

          case "ITALIC_UNDERLINE":
            return "<em><u>" + text.slice(start, end) + "</em></u>";

          case "BOLD_ITALIC_UNDERLINE":
            return "<strong><em><u>" + text.slice(start, end) + "</strong></em></u>";

          case "STRIKETHROUGH":
            return "<s>" + text.slice(start, end) + "</s>";

          case "CODE":
            return "<code>" + text.slice(start, end) + "</code>";

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
  let orderedListOpen = false;

  const parsedText = blocksArray.map(function(block, index) {

    const text = block.getText();
    const tree = editorState.getBlockTree(block.getKey());

    switch (block.type) {

      case 'unstyled':
        return "<p>" + convertInlineStyle(tree, block) + "</p>";

      case 'header-one':
        return "<h1>" + convertInlineStyle(tree, block) + "</h1>";

      case 'header-two':
        return "<h2>" + convertInlineStyle(tree, block) + "</h2>";

      case 'header-three':
        return "<h3>" + convertInlineStyle(tree, block) + "</h3>";

      case 'header-four':
        return "<h4>" + convertInlineStyle(tree, block) + "</h4>";

      case 'header-five':
        return "<h5>" + convertInlineStyle(tree, block) + "</h5>";

      case 'header-six':
        return "<h6>" + convertInlineStyle(tree, block) + "</h6>";

      case 'blockquote':
        return "<blockquote>" + convertInlineStyle(tree, block) + "</blockquote>";

      case 'unordered-list-item':
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

      case 'ordered-list-item':
        if (orderedListOpen) {
          if (blocksArray[index + 1] && blocksArray[index + 1].getType() == "ordered-list-item") {
            orderedListOpen = true;
            return "<li>" + convertInlineStyle(tree, block) + "</li>";
          } else {
            orderedListOpen = false;
            return "<li>" + convertInlineStyle(tree, block) + "</li></ol>";
          }
        }

        if (!orderedListOpen) {
          if (blocksArray[index + 1] && blocksArray[index + 1].getType() == "ordered-list-item") {
            orderedListOpen = true;
            return "<ol><li>" + convertInlineStyle(tree, block) + "</li>";
          } else {
            orderedListOpen = false;
            return "<ol><li>" + convertInlineStyle(tree, block) + "</li></ol>";
          }
        }


      default:
        return block.text;
    }

  });

  return parsedText.join("");

}
