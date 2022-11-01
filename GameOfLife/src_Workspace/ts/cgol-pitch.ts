styleUrls: ['../../dest_Build/css/custom.css']

var howManyColumns = 0;
var howManyRows = 0;
var grid = new Array(howManyRows);
var tempGrid = new Array(howManyRows);
var running = false;
var gridDiv: HTMLDivElement;
var reproductionTime = 100;

// This class represents the grid element of the game of life.
// It is supported by the cgolpitchGridEditor, cgolpitchRunEditor and the cgolpitchSupportEditor.
class cgolpitch extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {

        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot == null) return;
        this.shadowRoot.innerHTML = `
        <div class="morePlace" id="cgollGrid">
        </div>
        `;

        running = false;
        var rButton = document.getElementById("runButton");
        var pButton = document.getElementById("pauseButton");
        var cButton = document.getElementById("clearButton");
        var raButton = document.getElementById("randomButton");
        var setSButton = document.getElementById("setSizeButton");
        var slider = document.getElementById("speedSlider");

        var levelInput = document.getElementById("loadLevelButton");
        if (levelInput == null) return;

        var gridEditor = new cgolpitchGridEditor;
        var supportEditor = new cgolpitchSupportEditor();

        levelInput.onclick = gridEditor.onLevelInput;

        var inputs = document.getElementsByTagName("input");
        var inputRows = inputs.namedItem("rowInput");
        var inputCols = inputs.namedItem("colInput");
        if (inputRows == null || inputCols == null || setSButton == null || rButton == null || pButton == null || cButton == null || raButton == null || slider == null) return
        inputRows.onchange = supportEditor.onRowsChanged;
        inputCols.onchange = supportEditor.onColsChanged;
        raButton.onclick = gridEditor.onRandomField;
        howManyRows = 25;
        howManyColumns = 60;
        setSButton.onclick = gridEditor.onSetSize;
        slider.onchange = supportEditor.onChangeSpeed;
        supportEditor.onChangeSpeed();

        rButton.onclick = function () {
            if (!running) {
                running = true;
                cgolpitchRunEditor.run();
            }
        }

        pButton.onclick = function () {
            if (running) {
                running = false;
                var timer = 0;
                clearTimeout(timer);
            }
        }
        cButton.onclick = cgolpitchGridEditor.onClearGrid;

        cgolpitchGridEditor.createGameField(function (butto: HTMLButtonElement, y: Number, x: Number) {
            butto.setAttribute("class", "notAliveYet");
        });

        window.onresize = supportEditor.onWindowResized;
    }
}

// This class has all the stuff that edits and creates the grid from the cgolpitch.
// most of them occur due to buttons, which are assigned in cgolpitch.
class cgolpitchGridEditor {

    onSetSize() {
        running = false;
        var cGrid = document.getElementById("containerGrid");
        //var cGrid = that.shadowRoot.getElementById('cgollGrid');
        if (cGrid == null) return;
        while (cGrid.childNodes.item(0)) cGrid.removeChild(cGrid.childNodes.item(0));

        cgolpitchGridEditor.createGameField(function (butto: HTMLButtonElement, y: number, x: number) {
            butto.setAttribute("class", "notAliveYet");
        });
    }

    onLevelInput() {
        running = false;
        var inputs = document.getElementsByTagName("textarea");
        var levelInput = inputs.namedItem("levelInput");
        if (levelInput == null) return;
        var text = levelInput.value.toString();
        var counter = 0;
        var newHowManyColumns = 0;
        var newHowManyRows = 0;

        while (counter < text.length) {
            newHowManyRows = newHowManyRows + 1;

            var tempColumns = 0;

            while (text[counter] != "\n") {
                counter = counter + 1;
                tempColumns = tempColumns + 1;
                if (counter == text.length) break;
            }
            counter = counter + 1;

            newHowManyColumns = Math.max(newHowManyColumns, tempColumns);
        }

        howManyColumns = Math.max(newHowManyColumns, 10);
        howManyRows = Math.max(newHowManyRows, 10);

        counter = 0;
        var newText = "";
        while (counter < text.length) {
            tempColumns = 0;
            while (text[counter] != "\n") {
                newText = newText + text[counter];
                counter = counter + 1;
                tempColumns = tempColumns + 1;
                if (counter == text.length) break;
            }

            counter = counter + 1;

            for (let index = 0; index < howManyColumns - tempColumns; index++) newText = newText + "0";
        }
        var cGrid = document.getElementById("containerGrid");
        //var cGrid = that.shadowRoot.getElementById('cgollGrid');
        if (cGrid == null) return;
        while (cGrid.childNodes.item(0)) cGrid.removeChild(cGrid.childNodes.item(0));

        cgolpitchGridEditor.createGameField(function (butto: HTMLButtonElement, y: number, x: number) {

            if (newText[y * howManyColumns + x] == "1") grid[y][x].setAttribute("class", "isAlive");

            else grid[y][x].setAttribute("class", "notAliveYet");
        });
    }

    onRandomField() {
        cgolpitchGridEditor.onClearGrid();

        for (var index = 0; index < howManyRows; index++) {
            for (var index2 = 0; index2 < howManyColumns; index2++) {
                var alive = Math.round(Math.random());

                if (alive == 1) grid[index][index2].setAttribute("class", "isAlive");

                else grid[index][index2].setAttribute("class", "notAliveYet");
            }
        }
    }

    static onClearGrid() {
        if (running) running = false;

        for (let index = 0; index < howManyRows; index++) {
            for (let index2 = 0; index2 < howManyColumns; index2++) {
                grid[index][index2].id = index2.toString();
                grid[index][index2].setAttribute("class", "notAliveYet");
            }
        }
        var generationsCount = document.getElementById("generationsCount");
        generationsCount.textContent = "0";
    }

    static createGameField(functionn: Function) {
        var cGrid = document.getElementById("containerGrid");

        gridDiv = document.createElement("div");

        for (let y = 0; y < howManyRows; y++) {
            grid[y] = new Array(howManyColumns);
            var oneDiv = document.createElement("div");
            for (let x = 0; x < howManyColumns; x++) {

                grid[y][x] = document.createElement("button");

                var buttonSize = Math.min((window.innerWidth - 50) / howManyColumns, window.innerHeight / howManyRows);
                grid[y][x].id = x.toString();
                grid[y][x].style.width = buttonSize.toString() + "px";
                grid[y][x].style.height = buttonSize.toString() + "px";

                functionn(grid[y][x], y, x);

                grid[y][x].onclick = function () {
                    if (this.getAttribute("class") == "isAlive") this.setAttribute("class", "notAliveYet");

                    else if (this.getAttribute("class") == "notAliveYet") this.setAttribute("class", "isAlive");
                }

                oneDiv.style.border = "0";
                oneDiv.style.height = buttonSize.toString() + "px";
                oneDiv.appendChild(grid[y][x]);
            }
            gridDiv.appendChild(oneDiv);
        }
        if (cGrid == null) return;
        cGrid.appendChild(gridDiv);

        var inputs = document.getElementsByTagName("input");
        inputs.namedItem("colInput").value = String(howManyColumns);
        inputs.namedItem("rowInput").value = String(howManyRows);
    }
}

// This class is responsible for running, moving, evolution,
// the fields of the cgolpitch.
class cgolpitchRunEditor {

    static run() {
        if (running) cgolpitchRunEditor.oneEvolution();
        var timer;
        if (running) timer = setTimeout(cgolpitchRunEditor.run, reproductionTime);
    }

    static oneEvolution() {
        var stillEvolutiong = false;

        for (let index = 0; index < howManyRows; index++) {
            tempGrid[index] = new Array(howManyColumns);

            for (let index2 = 0; index2 < howManyColumns; index2++) {

                if (grid[index][index2].getAttribute("class") != undefined || grid[index][index2].getAttribute("class") != null) {
                    if (grid[index][index2].getAttribute("class") == "isAlive") tempGrid[index][index2] = 1;

                    else if (grid[index][index2].getAttribute("class") == "wasAlive") tempGrid[index][index2] = 0;

                    else tempGrid[index][index2] = -1;
                }
            }
        }

        for (let y = 0; y < howManyRows; y++) {
            for (let x = 0; x < howManyColumns; x++) {
                if (cgolpitchRunEditor.useRules(x, y)) stillEvolutiong = true;
            }
        }

        for (let index = 0; index < howManyRows; index++) {
            for (let index2 = 0; index2 < howManyColumns; index2++) {

                if (tempGrid[index][index2] == 1) grid[index][index2].setAttribute("class", "isAlive");

                else if (tempGrid[index][index2] == 0) grid[index][index2].setAttribute("class", "wasAlive");

                else grid[index][index2].setAttribute("class", "notAliveYet");
            }
        }

        if (stillEvolutiong) {
            var generationsCount = document.getElementById("generationsCount");
            var count = Number(generationsCount.textContent) + 1;
            generationsCount.textContent = String(count);
        };
    }

    static useRules(x: number, y: number): boolean {
        var count = 0;
        var statusChanged = false;

        for (let index = -1; index < 2; index++) {  //counting neighbours
            for (let index2 = -1; index2 < 2; index2++) {
                if (index != 0 || index2 != 0) {
                    if (grid[(y + index + howManyRows) % howManyRows][(x + index2 + howManyColumns) % howManyColumns].getAttribute("class") == "isAlive") count++; //neighbour found
                }
            }
        }

        if (grid[y][x].getAttribute("class") == "isAlive") {

            if (count < 2) { tempGrid[y][x] = 0; statusChanged = true; }
            else if (count == 2 || count == 3) tempGrid[y][x] = 1;
            else if (count > 3) { tempGrid[y][x] = 0; statusChanged = true; }

        } else if (grid[y][x].getAttribute("class") == "notAliveYet" || grid[y][x].getAttribute("class") == "wasAlive") {

            if (count == 3) { tempGrid[y][x] = 1; statusChanged = true; }
        }

        return statusChanged;
    }
}

// This class is responsible for the support methods of the cgolpitch.
class cgolpitchSupportEditor {

    onChangeSpeed() {
        var inputs = document.getElementsByTagName("input");
        var slider = inputs.namedItem("speedSlider");
        reproductionTime = 500 - Number(slider.value) * 5 + 5;
        var speedText = document.getElementById("timerSpeed");
        speedText.textContent = String(Number(slider.value));
    }

    onWindowResized() {
        var divs = gridDiv.getElementsByTagName("div");

        for (let index = 0; index < howManyRows; index++) {
            var current = divs.item(index);
            if (current == null) return;
            var buttons = current.getElementsByTagName("button");
            for (let index2 = 0; index2 < howManyColumns; index2++) {
                var butto = buttons.item(index2);
                var buttonSize = Math.min((window.innerWidth - 50) / howManyColumns, window.innerHeight / howManyRows);
                if (butto == null) return;
                butto.style.width = buttonSize.toString() + "px";
                butto.style.height = buttonSize.toString() + "px";
                current.style.height = buttonSize.toString() + "px";
            }
        }
    }

    onRowsChanged() {
        var inputs = document.getElementsByTagName("input");
        var rowInput = inputs.namedItem("rowInput");
        if (rowInput == null) return;
        if (Number(rowInput.value) < 101 && Number(rowInput.value) > 9) howManyRows = Number(rowInput.value);
    }

    onColsChanged() {
        var inputs = document.getElementsByTagName("input");
        var colInput = inputs.namedItem("colInput");
        if (colInput == null) return;
        if (Number(colInput.value) < 201 && Number(colInput.value) > 9) howManyColumns = Number(colInput.value);
    }
}


window.customElements.define('cgol-grid', cgolpitch);