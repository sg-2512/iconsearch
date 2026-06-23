// Show the plugin UI
figma.showUI(__html__, { width: 380, height: 500, themeColors: true });

// Listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'insert-icon') {
    try {
      const { svg, name } = msg;

      // Create a node from the SVG string
      const node = figma.createNodeFromSvg(svg);
      node.name = name || 'Icon';

      // Position the icon in the center of the current viewport
      const center = figma.viewport.center;
      node.x = center.x - node.width / 2;
      node.y = center.y - node.height / 2;

      // Add the node to the current page
      figma.currentPage.appendChild(node);

      // Select the inserted node and focus viewport on it
      figma.currentPage.selection = [node];

      figma.notify(`Inserted ${node.name} successfully!`);
    } catch (err) {
      console.error('Error inserting SVG into Figma:', err);
      figma.notify('Error inserting SVG: Please check the console.', { error: true });
    }
  }
};
