document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const viewToggle = document.getElementById('viewToggle');
  const exportImageBtn = document.getElementById('exportImageBtn');
  const copyImageBtn = document.getElementById('copyImageBtn');

  // Set URL for the SVG images
  const SVG_URL = 'https://glyphwiki.org/glyph/';

  // View mode: 'mixed' (default) or 'text'
  let viewMode = 'mixed';

  // Event listeners
  convertBtn.addEventListener('click', convertText);
  clearBtn.addEventListener('click', clearText);
  copyBtn.addEventListener('click', copyOutput);
  viewToggle.addEventListener('click', toggleViewMode);
  exportImageBtn.addEventListener('click', exportAsImage);
  copyImageBtn.addEventListener('click', copyAsImage);
  
  // Check if URL contains query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const queryText = urlParams.get('text');
  if (queryText) {
    inputText.value = queryText;
    convertText();
  }

  /**
   * Converts input text to second-stage simplified Chinese
   */
  function convertText() {
    const text = inputText.value.trim();
    if (!text) {
      showToast('请输入要转换的文本');
      return;
    }

    // 处理文本行，保留换行符
    const lines = text.split('\n');
    let html = '';
    
    lines.forEach((line, lineIndex) => {
      // 分割每行文本为字符数组
      const chars = Array.from(line);
      
      // 处理每个字符
      chars.forEach(char => {
        if (erzhDict[char]) {
          const glyphId = erzhDict[char];
          const svgUrl = `${SVG_URL}${glyphId}.svg`;
          html += `<span class="erzh-container">
                     <img class="erzh-char" src="${svgUrl}" alt="${char}" title="${char}">
                     <span class="erzh-char-original" style="display: none;">${char}</span>
                   </span>`;
        } else {
          html += `<span>${char}</span>`;
        }
      });
      
      // 在每行末尾添加换行符，除非是最后一行
      if (lineIndex < lines.length - 1) {
        html += '<br>';
      }
    });
    
    outputText.innerHTML = html;
    
    // Update view mode if necessary
    if (viewMode === 'text') {
      outputText.classList.add('view-mode-text');
    }
    
    // Update URL with the query parameter
    const url = new URL(window.location);
    url.searchParams.set('text', text);
    window.history.pushState({}, '', url);
  }

  /**
   * Clears input and output text areas
   */
  function clearText() {
    inputText.value = '';
    outputText.innerHTML = '转换后的内容将显示在这里...';
    
    // Update URL to remove the query parameter
    const url = new URL(window.location);
    url.searchParams.delete('text');
    window.history.pushState({}, '', url);
  }

  /**
   * Toggles between 'mixed' (images) and 'text' (original characters) view modes
   */
  function toggleViewMode() {
    if (viewMode === 'mixed') {
      viewMode = 'text';
      viewToggle.innerHTML = '<i class="fas fa-font"></i> 原字显示';
      outputText.classList.add('view-mode-text');
    } else {
      viewMode = 'mixed';
      viewToggle.innerHTML = '<i class="fas fa-eye"></i> 混合显示';
      outputText.classList.remove('view-mode-text');
    }
    
    // If there's content in the output, toggle visibility of elements
    const erzhChars = document.querySelectorAll('.erzh-char');
    const originals = document.querySelectorAll('.erzh-char-original');
    
    if (viewMode === 'text') {
      erzhChars.forEach(el => el.style.display = 'none');
      originals.forEach(el => el.style.display = 'inline');
    } else {
      erzhChars.forEach(el => el.style.display = 'inline-block');
      originals.forEach(el => el.style.display = 'none');
    }
  }

  /**
   * Copies the output content to clipboard
   */
  function copyOutput() {
    // Get all text nodes or plain text from output
    let outputContent = '';
    
    if (viewMode === 'mixed') {
      // In mixed mode, we want the original characters 
      // where ErZh characters are shown as images
      const nodes = outputText.childNodes;
      nodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          outputContent += node.textContent;
        } else if (node.classList && node.classList.contains('erzh-container')) {
          const original = node.querySelector('.erzh-char-original');
          if (original) {
            outputContent += original.textContent;
          }
        } else {
          outputContent += node.textContent;
        }
      });
    } else {
      // In text mode, we can simply get all text content
      outputContent = outputText.textContent;
    }
    
    // Create temporary textarea to copy content
    const textarea = document.createElement('textarea');
    textarea.value = outputContent;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showToast('已成功复制到剪贴板');
      } else {
        showToast('复制失败，请手动复制');
      }
    } catch (err) {
      showToast('复制失败，请手动复制');
      console.error('复制失败:', err);
    }
    
    document.body.removeChild(textarea);
  }

  /**
   * Shows a toast message
   * @param {string} message - The message to display
   */
  function showToast(message) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Exports the current output content as an image
   * @param {boolean} copyToClipboard - Whether to copy to clipboard instead of downloading
   */
  function exportAsImage(copyToClipboard = false) {
    const outputContent = outputText.innerHTML;
    if (outputContent === '转换后的内容将显示在这里...') {
      showToast(copyToClipboard ? '请先转换文本再复制图片' : '请先转换文本再导出图片');
      return;
    }

    // Create a container for the content to be rendered
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.backgroundColor = 'white';
    container.style.padding = '10px'; // Reduced padding for less whitespace
    container.style.maxWidth = outputText.offsetWidth + 'px';
    container.style.display = 'inline-block'; // Changed to inline-block to wrap content
    container.style.fontFamily = window.getComputedStyle(outputText).fontFamily;
    container.style.fontSize = window.getComputedStyle(outputText).fontSize;
    container.style.lineHeight = window.getComputedStyle(outputText).lineHeight;
    container.innerHTML = outputContent;
    document.body.appendChild(container);

    // Use html2canvas to render the content
    html2canvas(container, { 
      allowTaint: true, 
      useCORS: true,
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      logging: false
    }).then(canvas => {
      // Remove the temporary container
      document.body.removeChild(container);
      
      if (copyToClipboard) {
        // Copy the canvas to clipboard
        canvas.toBlob(blob => {
          try {
            // Try to use the modern Clipboard API
            if (navigator.clipboard && navigator.clipboard.write) {
              const clipboardItem = new ClipboardItem({ 'image/png': blob });
              navigator.clipboard.write([clipboardItem])
                .then(() => showToast('图片已成功复制到剪贴板'))
                .catch(err => {
                  console.error('复制图片失败:', err);
                  showToast('复制图片失败，请重试');
                });
            } else {
              // Fallback for browsers without Clipboard API support
              showToast('您的浏览器不支持直接复制图片');
              // Create a temporary link to download instead
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.download = '二简字转换结果.png';
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            }
          } catch (err) {
            console.error('复制图片失败:', err);
            showToast('复制图片失败，请重试');
          }
        });
      } else {
        // Create a download link
        const link = document.createElement('a');
        link.download = '二简字转换结果.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('图片已成功导出');
      }
    }).catch(err => {
      console.error('处理图片失败:', err);
      document.body.removeChild(container);
      showToast(copyToClipboard ? '复制图片失败，请重试' : '导出图片失败，请重试');
    });
  }

  /**
   * Copies the current output content as an image to clipboard
   */
  function copyAsImage() {
    exportAsImage(true);
  }
});
