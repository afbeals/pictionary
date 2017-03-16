'use strict';
(function(){
        window.mouseDown = false; // !! global
        document.body.addEventListener('mousedown', () => mouseDown = true);
        document.body.addEventListener('mouseup', () => mouseDown = false);
        document.body.addEventListener('mouseout', () => mouseDown = false);

    // ==== CANVAS ====
    window.canvas = document.querySelector('#canvas'); // !! global
    const ctx = canvas.getContext('2d');

    // draw styles
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1;

    var isDrawing = false;
    var lastX = 0;
    var lastY = 0;

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;

        if (canvasSettingsPanel.classList.contains('active')) {
            canvasSettingsPanel.classList.remove('active');
        }
    });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // height and width attributes my be dynamically set
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.clientWidth;





    // ==== BRUSH SETTINGS ====
    // == brush sizes
    var sizeSlider = document.querySelector('.cavasWrapper div.settings-row.brush-size > input[type="range"]');
    var sizeResult = document.querySelector('.cavasWrapper div.settings-row.brush-size > .result');

    sizeResult.style.fontSize = sizeSlider.value+'px';
    ctx.lineWidth = sizeSlider.value;

    function updateBrushSize(){
        if (!mouseDown) return;
        sizeResult.style.fontSize = this.value+'px';
        ctx.lineWidth = this.value;
    }

    sizeSlider.addEventListener('change', updateBrushSize);
    sizeSlider.addEventListener('mousemove', updateBrushSize);

    // == brush colors
    var colorSlider = document.querySelector('.cavasWrapper div.settings-row.brush-color > input[type="range"]');
    var colorResult = document.querySelector('.cavasWrapper div.settings-row.brush-color > .result');

    colorResult.style.color = `hsl(${colorSlider.value}, 100%, 50%)`;
    ctx.strokeStyle = `hsl(${colorSlider.value}, 100%, 50%)`;

    function updateBrushColor(){
        if (!mouseDown) return;
        const color = this.value
        colorResult.style.color = `hsl(${color}, 100%, 50%)`;
        ctx.strokeStyle = `hsl(${color}, 100%, 50%)`;
    }

    colorSlider.addEventListener('change', updateBrushColor);
    colorSlider.addEventListener('mousemove', updateBrushColor);

    // == show panel button
    var canvasSettingsBtn = document.querySelector('.cavasWrapper .canvas-btn');
    var canvasSettingsPanel = document.querySelector('.cavasWrapper .settings-panel');
    canvasSettingsBtn.addEventListener('click', toggleSettingsPanel);
    function toggleSettingsPanel(){
        if (canvasSettingsPanel.classList.contains('active')) {
            canvasSettingsPanel.classList.remove('active');
        } else {
            canvasSettingsPanel.classList.add('active');
        }
    }

}()) // end iife wrapper
