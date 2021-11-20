class BoggleGame {
    constructor(boardId) {
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);
        this.myTimer = $("#timer", this.board);

        $("#boggle", this.board).on("click", this.handleSubmit.bind(this));
        this.initTimer();
    }

    addWord(word) {
        $(".words", this.board).append($("<li>", {text: word}));
    }

    addScore(){
        $(".score", this.board).text(this.score);
    }

    addMessage(msg, cls) {
        $(".msg", this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`);
    }

    initTimer() {
        let time = 60;
        this.myTimer.text(time);
        const intervalValue = setInterval(() => {
            time = time - 1;
            this.myTimer.text(time);
            if (time == 0) {
                clearInterval(intervalValue);
                this.finalScore();
            }
        }, 1000);
    }

    async handleSubmit(e) {
        e.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
            this.addMessage(`You've already found ${word}`, "err");
            return;
        }

        //match word to database and raise appropiate response
        const resp = await axios.get("/check-word", {params: {word: word}});
        if (resp.data.result === "not-word") {
            this.addMessage(`${word} is not a word`, "err");
        } else if (resp.data.result === "not-on-board") {
            this.addMessage(`${word} is not on the board`, "err");
        } else {
            this.addWord(word);
            this.score += word.length;
            this.addScore();
            this.words.add(word);
            this.addMessage(`Added: ${word}`, "ok");
        }
        $word.val("").focus();
    }

    async finalScore() {
        $("#boggle", this.board).prop("onclick", null).off("click");
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
            this.addMessage(`New Highscore! ${this.score}`, "ok");
        } else {
            this.addMessage(`You scored ${this.score}`, "ok");
        }
    }
}