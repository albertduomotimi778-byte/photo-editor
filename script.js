const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
const canvasWrapper = document.getElementById('canvasWrapper');
const placeholder = document.getElementById('placeholderText');

let img = null;
const state = { brightness: 100, contrast: 100, grayscale: 0, blur: 0 };

function render() {
    if (!img) return;
    // Set filter string based on state
    ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%) grayscale(${state.grayscale}%) blur(${state.blur}px)`;
    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

upload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
        alert("Please select a valid image file.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            canvasWrapper.style.display = 'flex';
            placeholder.style.display = 'none';
            render();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

document.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', (e) => {
        state[e.target.id] = e.target.value;
        document.getElementById(`${e.target.id}-val`).innerText = e.target.value;
        render();
    });
});

document.getElementById('resetBtn').addEventListener('click', () => {
    state.brightness = 100; state.contrast = 100; state.grayscale = 0; state.blur = 0;
    document.querySelectorAll('input[type=range]').forEach(i => {
        i.value = i.id === 'blur' ? 0 : 100;
        document.getElementById(`${i.id}-val`).innerText = i.value;
    });
    render();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    if (!img) return;
    const link = document.createElement('a');
    link.download = `lumina-export-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});