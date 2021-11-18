from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from jinja2 import Template

app = Flask(__name__)
app.config['SECRET_KEY'] = "bogglebuddies"

boggle_game = Boggle()

@app.route("/")
def index():
    global boggle_game
    boggle_game = Boggle()
    board = boggle_game.make_board()
    session["board"] = board
    highscore = session.get("highscore", 0)
    return render_template('board.html', board=board, highscore = highscore)

@app.route("/check-word")
def check_word():
    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def post_score():
    score = request.json["score"]
    highscore = session.get("highscore", 0)

    session['highscore'] = max(score, highscore)

    return jsonify(newRecord = score > highscore)