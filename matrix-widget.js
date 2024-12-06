document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-cell-btn');
    const cellsContainer = document.querySelector('.matrix-cells');
    let isEditing = false;
    
    // Load saved cells from localStorage
    const loadSavedCells = () => {
        const savedCells = JSON.parse(localStorage.getItem('matrixCells') || '[]');
        savedCells.forEach(cellText => createItem(cellText));
    };

    // Save cells to localStorage
    const saveCells = () => {
        const items = Array.from(document.querySelectorAll('.matrix-item'))
            .map(item => item.textContent);
        localStorage.setItem('matrixCells', JSON.stringify(items));
    };

    // Create a display item
    const createItem = (text) => {
        const item = document.createElement('div');
        item.className = 'matrix-item';
        item.textContent = text;
        
        item.addEventListener('click', () => {
            if (!isEditing) {
                convertToEditor(item);
            }
        });

        cellsContainer.appendChild(item);
        return item;
    };

    // Convert item to editor
    const convertToEditor = (item) => {
        isEditing = true;
        const editor = document.createElement('textarea');
        editor.className = 'matrix-cell';
        editor.value = item.textContent;
        
        // Matrix-style typing effect
        editor.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const newText = editor.value.trim();
                if (newText) {
                    const newItem = createItem(newText);
                    editor.remove();
                    saveCells();
                }
                isEditing = false;
            } else {
                const glowEffect = editor.style.textShadow;
                editor.style.textShadow = '0 0 10px #0F0';
                setTimeout(() => {
                    editor.style.textShadow = glowEffect;
                }, 100);
            }
        });

        editor.addEventListener('blur', () => {
            const newText = editor.value.trim();
            if (newText) {
                const newItem = createItem(newText);
                editor.remove();
                saveCells();
            }
            isEditing = false;
        });

        item.replaceWith(editor);
        editor.focus();
    };

    // Add new cell when button is clicked
    addButton.addEventListener('click', () => {
        if (!isEditing) {
            const editor = document.createElement('textarea');
            editor.className = 'matrix-cell';
            cellsContainer.appendChild(editor);
            editor.focus();
            isEditing = true;

            editor.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const text = editor.value.trim();
                    if (text) {
                        createItem(text);
                        saveCells();
                    }
                    editor.remove();
                    isEditing = false;
                }
            });

            editor.addEventListener('blur', () => {
                const text = editor.value.trim();
                if (text) {
                    createItem(text);
                    saveCells();
                }
                editor.remove();
                isEditing = false;
            });
        }
    });

    // Load any previously saved cells
    loadSavedCells();
});
