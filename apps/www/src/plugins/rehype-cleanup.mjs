import { visit } from "unist-util-visit";

export default function rehypeCleanup() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "li" &&
        node.properties?.className?.includes("task-list-item")
      ) {
        const { children } = node;
        let inputIndex = -1;

        for (let i = 0; i < children.length; i += 1) {
          const child = children[i];
          if (
            child.type === "element" &&
            child.tagName === "input" &&
            child.properties?.type === "checkbox"
          ) {
            inputIndex = i;
            break;
          }
        }

        if (inputIndex !== -1) {
          for (let i = inputIndex + 1; i < children.length; i += 1) {
            const child = children[i];
            if (child.type === "comment") {
              continue;
            }
            if (child.type === "text") {
              if (child.value.startsWith(" ")) {
                child.value = child.value.replace(/^\s+/, "");
              }
              break;
            } else {
              break;
            }
          }
        }
      }

      if (node.tagName !== "p") {
        return;
      }
      if (!node.children?.length) {
        return;
      }
      if (!parent) {
        return;
      }

      const rawFigureNodes = [];

      for (const child of node.children) {
        if (
          child.type === "raw" &&
          child.value &&
          child.value.trim().startsWith("<figure")
        ) {
          rawFigureNodes.push(child);
        } else if (child.type !== "text" || child.value.trim() !== "") {
          return;
        }
      }

      if (rawFigureNodes.length > 0) {
        parent.children.splice(index, 1, ...rawFigureNodes);
        return index;
      }
    });
  };
}
