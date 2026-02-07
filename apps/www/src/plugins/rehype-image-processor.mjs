import { visit } from "unist-util-visit";

export default function rehypeImageProcessor() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p") {
        return;
      }
      if (!parent || typeof index !== "number") {
        return;
      }

      const imgNodes = [];
      let hasNonImageContent = false;

      for (const child of node.children) {
        if (child.type === "element" && child.tagName === "img") {
          imgNodes.push(child);
        } else if (child.type !== "text" || child.value.trim() !== "") {
          hasNonImageContent = true;
        }
      }

      if (hasNonImageContent || imgNodes.length === 0) {
        return;
      }

      const newNodes = [];
      let imageIndex = 0;

      for (const imgNode of imgNodes) {
        const alt = imgNode.properties?.alt?.trim();
        const isFirstImage = imageIndex === 0;

        imgNode.properties = {
          ...imgNode.properties,
          class: [...(imgNode.properties.class || []), "img-placeholder"],
          "data-preview": "true",
          decoding: "async",
          fetchpriority: isFirstImage ? "high" : "auto",
          loading: isFirstImage ? "eager" : "lazy",
        };

        imageIndex += 1;

        if (!alt || alt.includes("_")) {
          newNodes.push(imgNode);
          continue;
        }

        const figure = {
          children: [
            imgNode,
            {
              children: [
                {
                  type: "text",
                  value: alt,
                },
              ],
              properties: {
                className: ["img-caption"],
              },
              tagName: "figcaption",
              type: "element",
            },
          ],
          properties: {
            className: ["image-caption-wrapper"],
          },
          tagName: "figure",
          type: "element",
        };

        newNodes.push(figure);
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
        return index + newNodes.length - 1;
      }
    });
  };
}
