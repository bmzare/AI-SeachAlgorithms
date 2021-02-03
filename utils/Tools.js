class ToolsMazePiece extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsMazePiece");

        this.active = params.active;
        this.child = [];
        this.heuristic = params.heuristic;
        this.g = 0;
        this.f = 0;
        this.parent = null;
        // this.vision.innerHTML = this.heuristic;

        this.amounts = params.amounts;
        this.vision.style.borderLeftColor = (this.amounts[0] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderTopColor = (this.amounts[1] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderRightColor = (this.amounts[2] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderBottomColor = (this.amounts[3] === "0") ? "#1b4a1b" : "#fff";

        let asteriskIcon = document.createElement("i");
        asteriskIcon.classList.add("ToolsMazePiece_asteriskIcon");
        asteriskIcon.classList.add("fas", "fa-asterisk");
        this.asteriskIcon = asteriskIcon;
        if (this.active) {
            this.vision.appendChild(asteriskIcon);
        }
    }

    initialParams() {
        if (typeof this.params.amounts === "undefined") {
            this.params.amounts = "0000";
        }
        if (typeof this.params.heuristic === "undefined") {
            this.params.heuristic = 0;
        }
        if (typeof this.params.entranceSide === "undefined") {
            this.params.entranceSide = null;
        }
        if (typeof this.params.active === "undefined") {
            this.params.active = false;
        }
    }

    setAmounts(arr) {
        this.amounts = arr;
        this.vision.style.borderLeftColor = (this.amounts[0] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderTopColor = (this.amounts[1] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderRightColor = (this.amounts[2] === "0") ? "#1b4a1b" : "#fff";
        this.vision.style.borderBottomColor = (this.amounts[3] === "0") ? "#1b4a1b" : "#fff";
    }

    getAmounts() {
        return this.amounts;
    }

    addChild(amount) {
        this.child.push(amount);
    }

    getChild() {
        return this.child;
    }

    getHeuristic() {
        return this.heuristic;
    }

    setActive() {
        this.active = true;
        this.vision.appendChild(this.asteriskIcon);
    }

    setF(amount) {
        this.f = amount;
    }

    setG(amount) {
        this.g = amount;
    }

    getF() {
        return this.f;
    }

    getG() {
        return this.g;
    }

    setParent(state) {
        this.parent = state;
    }

    getParent() {
        return this.parent;
    }
}
class ToolsMazeBoard extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsMazeBoard");

        this.states = [[], [], [], [], [], [], [], [], [], []];

        this.startState = params.startState;
        this.goalState = params.goalState;
        this.openStates = [this.startState];
        this.closedStates = [];
        this.path = [];

        let rowsDiv = [];
        for (let i = 0; i < params.boardAmounts.length; i++) {
            rowsDiv[i] = document.createElement("div");
            rowsDiv[i].classList.add("ToolsMazeBoard_rowDiv")
        }

        for (let i = 0; i < params.boardAmounts.length; i++) {
            for (let j = 0; j < params.boardAmounts.length; j++) {
                let newPiece = new ToolsMazePiece(this, {
                    amounts: params.boardAmounts[i][j],
                    heuristic: this.calculateHeuristic(i, j, params.goalState),
                });
                this.states[i][j] = newPiece;
                newPiece.moveIn(null, rowsDiv[i]);
            }
        }

        for (let i = 0; i < params.boardAmounts.length; i++) {
            this.vision.appendChild(rowsDiv[i]);
        }
    }

    initialParams() {
        if (typeof this.params.boardAmounts === "undefined") {
            this.params.boardAmounts = [
                ["0011", "1011", "1011", "1011", "1001"],
                ["0111", "1111", "1111", "1111", "1101"],
                ["0111", "1111", "1111", "1111", "1101"],
                ["0111", "1111", "1111", "1111", "1101"],
                ["0110", "1110", "1110", "1110", "1100"]
            ];
        }
        if (typeof this.params.startState === "undefined") {
            this.params.startState = "00";
        }
        if (typeof this.params.goalState === "undefined") {
            this.params.goalState = "44";
        }
    }

    calculateHeuristic(i, j, goalState) {
        let x = Math.abs(parseInt(goalState[0]) - i);
        let y = Math.abs(parseInt(goalState[1]) - j);
        return (x + y);
    }

    findSolution(i, j) {
        console.log(i + "-" + j);
        let amountOfState = this.states[i][j].getAmounts();
        if (i + "" + j === this.goalState) {
            console.log("gg");
            this.findPath(this.goalState);
            return;
        }
        this.closedStates.push(i + "" + j);
        if (amountOfState[0] === "1" && !this.openStates.includes(i.toString() + (j - 1).toString())) {
            this.openStates.push(i + "" + (j - 1));
            this.states[i][j].addChild(i + "" + (j - 1));
            this.states[i][j - 1].setG(this.states[i][j].getG() + 1);
            this.states[i][j - 1].setF(this.states[i][j - 1].getG() + this.states[i][j - 1].getHeuristic());
            this.states[i][j - 1].setParent(i + "" + j);
        }
        if (amountOfState[1] === "1" && !this.openStates.includes((i - 1).toString() + j.toString())) {
            this.openStates.push((i - 1) + "" + j);
            this.states[i][j].addChild((i - 1) + "" + j);
            this.states[i - 1][j].setG(this.states[i][j].getG() + 1);
            this.states[i - 1][j].setF(this.states[i - 1][j].getG() + this.states[i - 1][j].getHeuristic());
            this.states[i - 1][j].setParent(i + "" + j);
        }
        if (amountOfState[2] === "1" && !this.openStates.includes(i.toString() + (j + 1).toString())) {
            this.openStates.push(i + "" + (j + 1));
            this.states[i][j].addChild(i + "" + (j + 1));
            this.states[i][j + 1].setG(this.states[i][j].getG() + 1);
            this.states[i][j + 1].setF(this.states[i][j + 1].getG() + this.states[i][j + 1].getHeuristic());
            this.states[i][j + 1].setParent(i + "" + j);
        }
        if (amountOfState[3] === "1" && !this.openStates.includes((i + 1).toString() + j.toString())) {
            this.openStates.push((i + 1) + "" + j);
            this.states[i][j].addChild((i + 1) + "" + j);
            this.states[i + 1][j].setG(this.states[i][j].getG() + 1);
            this.states[i + 1][j].setF(this.states[i + 1][j].getG() + this.states[i + 1][j].getHeuristic());
            this.states[i + 1][j].setParent(i + "" + j);
        }
        let nextState = this.findBestState();
        this.findSolution(parseInt(nextState[0]), parseInt(nextState[1]));
    }

    findBestState() {
        let differenceOpenAndClosed = this.openStates.filter(x => !this.closedStates.includes(x));
        let openStates = [];
        for (let k = 0; k < differenceOpenAndClosed.length; k++) {
            openStates.push({
                state: differenceOpenAndClosed[k],
                f: this.states[differenceOpenAndClosed[k][0]][differenceOpenAndClosed[k][1]].getF()
            });
        }
        openStates.sort((a, b) => (a.f > b.f ? 1 : -1));

        console.log(openStates);
        return openStates[0].state[0] + "" + openStates[0].state[1];
    }

    findPath(state) {
        this.path.push(state);
        if (state !== this.startState) {
            this.findPath(this.states[parseInt(state[0])][parseInt(state[1])].getParent());
        }
    }

    getOpenStates() {
        return this.openStates;
    }

    getClosedStates() {
        return this.closedStates;
    }

    getStates() {
        return this.states;
    }

    getPath() {
        return this.path;
    }
}

class ToolsChessPiece extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsChessPiece");
        this.vision.style.backgroundColor = (params.colorMode === 1) ? "#7e5733" : "#c6a07d";
        this.colorMode = params.colorMode;

        this.hasQueen = params.hasQueen;

        let asteriskIcon = document.createElement("i");
        asteriskIcon.classList.add("ToolsChessPiece_asteriskIcon");
        asteriskIcon.classList.add("fas", "fa-chess-queen");
        this.asteriskIcon = asteriskIcon;
        if (this.hasQueen) {
            this.vision.appendChild(asteriskIcon);
        }
    }

    initialParams() {
        if (typeof this.params.onClick === "undefined") {
            this.params.onClick = null;
        }
        if (typeof this.params.colorMode === "undefined") {
            this.params.colorMode = 1;
        }
        if (typeof this.params.hasQueen === "undefined") {
            this.params.hasQueen = false;
        }
    }

    setHasQueen(boolean) {
        this.hasQueen = boolean;
        if (boolean) {
            this.vision.appendChild(this.asteriskIcon);
        } else {
            this.vision.removeChild(this.asteriskIcon);
        }
    }
}
class ToolsChessBoard extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsChessBoard");

        this.n = params.n;
        this.states = [[], [], [], [], [], [], [], []];
        this.queens = params.queens;
        this.t = params.t;

        let columnsDiv = [];
        for (let i = 0; i < params.queens.length; i++) {
            columnsDiv[i] = document.createElement("div");
            columnsDiv[i].classList.add("ToolsChessBoard_columnsDiv")
        }

        for (let i = 0; i < params.n; i++) {
            if (this.isEven(i)) {
                for (let j = 0; j < params.n; j++) {
                    let newPiece = new ToolsChessPiece(this, {
                        hasQueen: (params.queens[i] === j),
                        colorMode: (this.isEven(j)) ? 1 : 2,
                        value: i + "-" + j
                    });
                    this.states[i][j] = newPiece;
                    newPiece.moveIn(null, columnsDiv[i]);
                }
            } else {
                for (let j = 0; j < params.n; j++) {
                    let newPiece = new ToolsChessPiece(this, {
                        hasQueen: (params.queens[i] === j),
                        colorMode: (this.isEven(j)) ? 2 : 1,
                        value: i + "-" + j
                    });
                    this.states[i][j] = newPiece;
                    newPiece.moveIn(null, columnsDiv[i]);
                }
            }
        }
        this.evaluation = this.calculateEvaluation();
        this.findSolution();

        for (let i = 0; i < params.n; i++) {
            this.vision.appendChild(columnsDiv[i]);
        }
    }

    initialParams() {
        if (typeof this.params.n === "undefined") {
            this.params.n = 8;
        }
        if (typeof this.params.queens === "undefined") {
            this.params.queens = [0, 0, 0, 0, 0, 0, 0, 0];
        }
        if (typeof this.params.t === "undefined") {
            this.params.t = 10;
        }
    }

    findSolution() {
        if (this.evaluation === 0) {
            console.log("finish - gg");
            return;
        }
        let previousQueens = [...this.queens];

        let randomColumn = this.randomNumber([-1]);
        let notAllowed = [];
        for (let i = 0; i < this.n; i++) {
            notAllowed.push(this.queens[i]);
        }
        let uniqueNotAllowed = notAllowed.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
        let randomState = this.randomNumber((uniqueNotAllowed.length !== this.n) ? uniqueNotAllowed : this.states[randomColumn]);
        this.queenMovement(randomColumn, randomState);
        if (this.calculatePossibility()) {
            if (this.t !== 0) {
                this.findSolution();
            } else {
                console.log("finish - failed");
            }
        } else {
            this.queenMovement(randomColumn, previousQueens[randomColumn]);
            if (this.t !== 0) {
                this.findSolution();
            } else {
                console.log("finish - failed");
            }
        }
    }

    queenMovement(column, row) {
        this.states[column][this.queens[column]].setHasQueen(false);
        this.states[column][row].setHasQueen(true);
        this.queens[column] = row;
    }

    calculatePossibility() {
        let deltaE = this.calculateEvaluation() - this.evaluation;
        let possibility = Math.pow(Math.E, (((-1) * deltaE) / this.t));
        this.t--;
        if (deltaE < 0) {
            this.evaluation = this.calculateEvaluation();
            return true;
        } else {
            if (Math.random() < possibility) {
                this.evaluation = this.calculateEvaluation();
                return true;
            } else {
                return false;
            }
        }
    }

    calculateEvaluation() {
        let e = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = i + 1; j < this.n; j++) {
                if (this.queens[j] === this.queens[i]) {
                    e++;
                }
                if ((this.queens[j] - this.queens[i]) / (i - j) === -1) {
                    e++;
                }
                if ((this.queens[j] - this.queens[i]) / (i - j) === 1) {
                    e++;
                }
            }
        }
        return e;
    }

    isEven(number) {
        return number % 2 === 0;
    }

    randomNumber(numbers) {
        let trueRandom = false;
        let randomNumber = 0;
        while (!trueRandom) {
            let r = parseInt(Math.random().toString()[2]);
            if (r < this.n && !numbers.includes(r)) {
                trueRandom = true;
                randomNumber = r;
                break;
            }
        }
        return randomNumber;
    }
}


class ToolsTicTacToePiece extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsTicTacToePiece");
        this.mode = params.mode;
        this.locked = params.locked;

        let icon = document.createElement("i");
        icon.classList.add("ToolsMazePiece_icon");
        if (params.mode === "o") {
            icon.classList.add("fas", "fa-at");
        } else if (params.mode === "x") {
            icon.classList.add("fas", "fa-times");
        } else {
            icon.classList.add("fas");
        }
        this.icon = icon;

        this.vision.addEventListener("click", (event) => {
            if (params.onClick !== null) {
                params.onClick(event);
            }
        });

        if (!this.locked) {
            this.vision.classList.add("ToolsTicTacToePiece_hover");
        }

        this.icon = icon;
        this.vision.appendChild(icon);
    }

    initialParams() {
        if (typeof this.params.onClick === "undefined") {
            this.params.onClick = null;
        }
        if (typeof this.params.mode === "undefined") {
            this.params.mode = "n";
        }
        if (typeof this.params.locked === "undefined") {
            this.params.locked = false;
        }
    }

    setMode(mode) {
        switch (mode) {
            case "x":
                this.mode = mode;
                this.icon.classList.remove("fa-at");
                this.icon.classList.add("fa-times");
                this.locked = true;
                break;
            case "o":
                this.mode = mode;
                this.icon.classList.remove("fa-times");
                this.icon.classList.add("fa-at");
                this.locked = true;
                break;
            default:
                this.icon.classList.remove("fa-at");
                this.icon.classList.remove("fa-times");
                this.locked = false;

        }
    }

    getMode() {
        return this.mode;
    }

    getLocked() {
        return this.locked;
    }
}
class ToolsTicTacToeBoard extends View {
    buildVision(params) {
        this.initialParams();
        this.vision.classList.add("ToolsTicTacToeBoard");

        this.states = [[], [], []];
        this.n = params.n;

        let rowsDiv = [];
        for (let i = 0; i < this.n; i++) {
            rowsDiv[i] = document.createElement("div");
            rowsDiv[i].classList.add("ToolsTicTacToeBoard_rowDiv")
        }

        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                let newState = new ToolsTicTacToePiece(this, {
                    mode: "n",
                    onClick: (event) => {
                        if (!newState.getLocked()) {
                            newState.setMode("x");
                            for (let k = 0; k < this.n; k++) {
                                for (let l = 0; l < this.n; l++) {
                                    this.currentState[k][l] = this.states[k][l].getMode();
                                }
                            }
                            let newModes = this.alphaBetaSearch(this.currentState);
                            console.log(newModes);
                            for (let k = 0; k < this.n; k++) {
                                for (let l = 0; l < this.n; l++) {
                                    if(newModes[k][l] !== "n"){
                                        this.states[k][l].setMode(newModes[k][l]);
                                        this.currentState[k][l] = newModes[k][l];
                                    }
                                }
                            }
                        }
                    }
                });
                this.states[i][j] = newState;
                newState.moveIn(null, rowsDiv[i]);
            }
        }
        this.currentState = [[], [], []];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                this.currentState[i][j] = this.states[i][j].getMode();
            }
        }
        this.newStateComp = [];
        console.log(this.currentState);

        for (let i = 0; i < this.n; i++) {
            this.vision.appendChild(rowsDiv[i]);
        }
    }

    initialParams() {
        if (typeof this.params.onClick === "undefined") {
            this.params.onClick = null;
        }
        if (typeof this.params.n === "undefined") {
            this.params.n = 3;
        }
    }

    alphaBetaSearch(state) {
        let v = this.maxValue(state, -1000000000000, +1000000000000);
        return this.newStateComp;
    }

    maxValue(state, alpha, beta) {
        if (this.terminalTest(state)) {
            return this.utility(state);
        }
        let v = -1000000000000;
        let previousV = v;
        let child = this.successors(state, "o");
        for (let i = 0; i < child.length; i++) {
            let previousV = v;
            v = Math.max(v, this.minValue(child[i], alpha, beta));
            if (previousV === v) {
                this.newStateComp = child[i];
                previousV = v
            }
            if (v >= beta) {
                return v;
            }
            alpha = Math.max(alpha, v);
        }
        return v;
    }

    minValue(state, alpha, beta) {
        if (this.terminalTest(state)) {
            return this.utility(state);
        }
        let v = +1000000000000;
        let previousV = v
        let child = this.successors(state, "x");
        for (let i = 0; i < child.length; i++) {

            v = Math.min(v, this.maxValue(child[i], alpha, beta));
            if (previousV === v) {
                this.newStateComp = child[i];
                previousV = v
            }
            if (v <= alpha) {
                return v;
            }
            beta = Math.min(beta, v);
        }
        return v;
    }

    terminalTest(state) {
        let utility = this.utility((state));
        if (utility === 1 || utility === -1) {
            return true;
        } else {
            let complete = true;
            for (let i = 0; i < this.n; i++) {
                for (let j = 0; j < this.n; j++) {
                    if (state[i][j] === "n") {
                        complete = false;
                        return false;
                    }
                }
            }
            return true;
        }
    }

    utility(state) {
        let rowModes = [];
        let columnModes = [];
        let MultiplicationModes1 = [];
        let MultiplicationModes2 = [state[0][2], state[1][1], state[2][0]];
        let a = 0;
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                rowModes.push(state[i][j]);
                columnModes.push(state[j][i]);
                MultiplicationModes1.push(state[j][j]);
            }
            if (!MultiplicationModes1.includes("n") && !MultiplicationModes1.includes("x")) {
                return 1;
            } else if (!MultiplicationModes1.includes("n") && !MultiplicationModes1.includes("o")) {
                return -1;
            }
            if (!rowModes.includes("n") && !rowModes.includes("x")) {
                return 1;
            } else if (!rowModes.includes("n") && !rowModes.includes("o")) {
                return -1;
            }
            if (!columnModes.includes("n") && !columnModes.includes("x")) {
                return 1;
            } else if (!columnModes.includes("n") && !columnModes.includes("o")) {
                return -1;
            }
            rowModes = [];
            columnModes = [];
        }
        if (a !== 0) {
            if (!MultiplicationModes2.includes("n") && !MultiplicationModes2.includes("x")) {
                return 1;
            } else if (!MultiplicationModes2.includes("n") && !MultiplicationModes2.includes("o")) {
                return -1;
            }
        }
        return a;
    }

    successors(state, newMode) {
        let nullPieces = [];
        let childStates = [];
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.n; j++) {
                if (state[i][j] === "n") {
                    nullPieces.push(i.toString() + j.toString());
                }
            }
        }
        for (let i = 0; i < nullPieces.length; i++) {
            let children = state.map(a => Object.assign({}, a));
            children[parseInt(nullPieces[i][0])][parseInt(nullPieces[i][1])] = newMode;
            childStates.push(children);
        }
        return childStates;
    }

}