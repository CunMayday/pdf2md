// Export button injection script
// This script adds an export button to the PDF to Markdown converter

(function() {
    // Wait for the page to load
    function addExportButton() {
        // Find the button toolbar
        const toolbar = document.querySelector('.btn-toolbar');
        if (!toolbar) {
            // If toolbar not found yet, try again in 500ms
            setTimeout(addExportButton, 500);
            return;
        }

        // Check if export button already exists
        if (document.getElementById('export-markdown-btn')) {
            return;
        }

        // Create export button
        const exportBtn = document.createElement('button');
        exportBtn.id = 'export-markdown-btn';
        exportBtn.className = 'btn btn-primary';
        exportBtn.textContent = 'Export Markdown';
        exportBtn.style.marginLeft = '10px';

        // Add click handler
        exportBtn.onclick = function() {
            // Get the markdown text
            const textarea = document.querySelector('textarea');
            let text = '';

            if (textarea && textarea.style.display !== 'none') {
                // If in edit mode, get from textarea
                text = textarea.value;
            } else {
                // If in preview mode, we need to get the original text
                // Store it when switching modes
                if (window.markdownText) {
                    text = window.markdownText;
                } else {
                    alert('Please switch to Edit mode first, then try exporting.');
                    return;
                }
            }

            // Create and download file
            const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'converted.md';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };

        // Find the first button group and add our button after it
        const firstButtonGroup = toolbar.querySelector('.btn-group');
        if (firstButtonGroup) {
            firstButtonGroup.parentNode.insertBefore(exportBtn, firstButtonGroup.nextSibling);
        }

        // Store markdown text when textarea changes
        const textarea = document.querySelector('textarea');
        if (textarea) {
            window.markdownText = textarea.value;
            textarea.addEventListener('input', function() {
                window.markdownText = this.value;
            });
        }
    }

    // Start trying to add the button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addExportButton);
    } else {
        addExportButton();
    }
})();
