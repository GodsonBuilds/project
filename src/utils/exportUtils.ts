import { Canvas, ExportOptions } from '../types/posterBuilderTypes';

// Helper to load an image as Promise
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = src;
  });
};

// Render the canvas to an actual HTML Canvas element
export const renderCanvasToImage = async (
  canvas: Canvas,
  options: ExportOptions
): Promise<string> => {
  const htmlCanvas = document.createElement('canvas');
  htmlCanvas.width = canvas.width;
  htmlCanvas.height = canvas.height;
  
  const ctx = htmlCanvas.getContext('2d');
  if (!ctx) throw new Error('Unable to get canvas context');
  
  // Fill background
  ctx.fillStyle = canvas.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw background image if present
  if (canvas.backgroundImage) {
    try {
      const img = await loadImage(canvas.backgroundImage);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    } catch (error) {
      console.error('Failed to load background image:', error);
    }
  }
  
  // Draw title
  ctx.save();
  if (canvas.title.backgroundColor !== 'transparent') {
    ctx.fillStyle = canvas.title.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.title.fontSize + canvas.title.padding * 2);
  }
  
  ctx.font = `${canvas.title.fontWeight} ${canvas.title.fontSize}px ${canvas.title.fontFamily}`;
  ctx.fillStyle = canvas.title.color;
  ctx.textAlign = canvas.title.textAlign as CanvasTextAlign;
  
  let titleX = canvas.width / 2;
  if (canvas.title.textAlign === 'left') titleX = canvas.title.padding;
  if (canvas.title.textAlign === 'right') titleX = canvas.width - canvas.title.padding;
  
  ctx.fillText(
    canvas.title.text,
    titleX,
    canvas.title.fontSize + canvas.title.padding
  );
  ctx.restore();
  
  // Draw grid lines if not explicitly hidden
  ctx.save();
  ctx.strokeStyle = '#ddd'; // Light gray for grid lines
  ctx.lineWidth = 1;
  
  // Draw grid cells and their boundaries
  for (const cell of canvas.grid.cells) {
    // Draw cell border if grid lines should be shown
    if (!(canvas as any).hideGridLines) {
      ctx.strokeRect(cell.x, cell.y, cell.width, cell.height);
    }
    
    // Draw cell elements
    await Promise.all(
      cell.elements.map(async (element) => {
        ctx.save();
        
        // Apply element transformations
        const centerX = element.x + element.width / 2;
        const centerY = element.y + element.height / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((element.rotation * Math.PI) / 180);
        
        if (element.type === 'text') {
          // Draw text element background
          if (element.backgroundColor !== 'transparent') {
            ctx.fillStyle = element.backgroundColor;
            ctx.fillRect(
              -element.width / 2,
              -element.height / 2,
              element.width,
              element.height
            );
          }
          
          // Draw text
          ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
          ctx.fillStyle = element.color;
          ctx.textAlign = element.textAlign as CanvasTextAlign;
          
          let textX = 0;
          if (element.textAlign === 'left') textX = -element.width / 2 + element.padding;
          if (element.textAlign === 'right') textX = element.width / 2 - element.padding;
          
          ctx.fillText(
            element.content,
            textX,
            element.fontSize / 3
          );
        } else if (element.type === 'image') {
          try {
            const img = await loadImage(element.src);
            ctx.drawImage(
              img,
              -element.width / 2,
              -element.height / 2,
              element.width,
              element.height
            );
          } catch (error) {
            console.error('Failed to load element image:', error);
          }
        }
        
        ctx.restore();
      })
    );
  }
  
  ctx.restore();
  
  // Draw loose elements (not in grid cells)
  await Promise.all(
    canvas.elements.map(async (element) => {
      ctx.save();
      
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      if (element.type === 'text') {
        if (element.backgroundColor !== 'transparent') {
          ctx.fillStyle = element.backgroundColor;
          ctx.fillRect(
            -element.width / 2,
            -element.height / 2,
            element.width,
            element.height
          );
        }
        
        ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.textAlign = element.textAlign as CanvasTextAlign;
        
        let textX = 0;
        if (element.textAlign === 'left') textX = -element.width / 2 + element.padding;
        if (element.textAlign === 'right') textX = element.width / 2 - element.padding;
        
        ctx.fillText(
          element.content,
          textX,
          element.fontSize / 3
        );
      } else if (element.type === 'image') {
        try {
          const img = await loadImage(element.src);
          ctx.drawImage(
            img,
            -element.width / 2,
            -element.height / 2,
            element.width,
            element.height
          );
        } catch (error) {
          console.error('Failed to load element image:', error);
        }
      }
      
      ctx.restore();
    })
  );
  
  // Convert to image data URL with proper format and quality
  const mimeType = `image/${options.format}`;
  return htmlCanvas.toDataURL(mimeType, options.quality / 100);
};

// Download the canvas as an image
export const downloadCanvasAsImage = async (
  canvas: Canvas,
  options: ExportOptions
): Promise<void> => {
  try {
    const dataUrl = await renderCanvasToImage(canvas, options);
    
    const link = document.createElement('a');
    link.download = `${options.fileName}.${options.format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to export canvas:', error);
    throw error;
  }
};