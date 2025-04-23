document.addEventListener('DOMContentLoaded', () => {
  // Cache DOM elements
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const convertBtn = document.getElementById('convertBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const viewToggle = document.getElementById('viewToggle');

  // Set URL for the SVG images
  const SVG_URL = 'https://glyphwiki.org/glyph/';

  // View mode: 'mixed' (default) or 'text'
  let viewMode = 'mixed';

  // Event listeners
  convertBtn.addEventListener('click', convertText);
  clearBtn.addEventListener('click', clearText);
  copyBtn.addEventListener('click', copyOutput);
  viewToggle.addEventListener('click', toggleViewMode);
  
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

    // Split text into characters
    const chars = Array.from(text);
    
    // Create HTML output
    let html = '';
    
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
});
