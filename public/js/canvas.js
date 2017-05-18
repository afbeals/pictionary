'use strict';
createCanvas = function(){
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
    var playerLastX = -100;
    var playerLastY = -100;
    var ctxPackage = {};

    function draw(e) {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        lastX = e.offsetX;
        lastY = e.offsetY;
        ctxPackage['offsetX'] = e.offsetX / canvas.width;
        ctxPackage['offsetY'] = e.offsetY / canvas.height;
        ctxPackage['lastX'] = e.offsetX / canvas.width;
        ctxPackage['lastY'] = e.offsetY  / canvas.height;
        socket.emit('playerDrawing', {ctxPackage:ctxPackage,player:playerPayload});
        console.log('playerDrawing', ctxPackage);
    }

    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mousedown', (e) => {
        player.draw ? (
                        isDrawing = true, 
                        lastX = e.offsetX,
                        lastY = e.offsetY,
                        (canvasSettingsPanel.classList.contains('active')) ? canvasSettingsPanel.classList.remove('active') : null
                        ): isDrawing = false
    });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    // height and width attributes my be dynamically set
    /*need to also set #screen to same height
    let screen = document.getElementById('screen');
    screen.height = canvas.clientHeight;
    screen.width = canvas.clientWidth;
    */
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
        ctxPackage['lineWidth'] = sizeSlider.value;
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
        ctxPackage['strokeStyle'] = `hsl(${color}, 100%, 50%)`;
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

    // == Socket IO

    socket.on('playerStartedDrawing',function(ctxServerpackage){
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = ctxServerpackage.strokeStyle;
        if(playerLastX != ctxServerpackage.offsetX){playerLastX = ctxServerpackage.offsetX};
        if(playerLastY != ctxServerpackage.offsetY){playerLastY = ctxServerpackage.offsetY};
        ctx.moveTo(playerLastX * canvas.width, playerLastY * canvas.height);
        ctx.lineTo(ctxServerpackage.offsetX * canvas.width, ctxServerpackage.offsetY * canvas.height);
        ctx.lineWidth = ctxServerpackage.lineWidth;
        ctx.stroke();
        playerLastX = ctxServerpackage.offsetX;
        playerLastY = ctxServerpackage.offsetY;

    });
} // end iife wrapper
