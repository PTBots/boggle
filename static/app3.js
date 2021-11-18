$(function(){
    var TIMER = $('#timer')

    let decreaseTime = (setInterval(function() {
        let currTime = Number(TIMER.text())
        currTime--
        if (currTime <= 0){
            clearInterval(decreaseTime)
        }
        TIMER.text(currTime)
    }, 1000))
})

class BoggleGame {
    constructor(boardId) {
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);

        $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
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

    async handleSubmit(e) {
        e.preventDefault();
        const $word = $(".word", this.board);

        let word = $word.val();
        if (!word) return;

        if (this.words.has(word)) {
            this.addMessage(`You've already found ${word}`, "err");
            return;
        }

        //match word to database
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
        $(".add-word", this.board).hide();
        const resp = await axios.post("/post-score", { score: this.score });
        if (resp.data.brokeRecord) {
            this.addMessage(`New Highscore! ${this.score}`, "ok");
        } else {
            this.addMessage(`You scored ${this.score}`, "ok");
        }
    }
}