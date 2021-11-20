from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle

    # TODO -- write tests for every view function / feature!

class FlaskTests(TestCase):

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_valid_word(self):
        with self.client as client:
            with client.session_transaction() as sess:
                sess['board'] = [["B", "O", "G", "G", "L"],
                                 ["R", "O", "C", "K", "E"],
                                 ["R", "I", "G", "H", "S"],
                                 ["A", "B", "C", "D", "T"],
                                 ["E", "F", "G", "H", "I"]]
        response = self.client.get('/check-word?word=boggle')
        self.assertEqual(response.json['result'], 'ok')

    def test_invalid_word(self):
        self.client.get('/')
        response = self.client.get('/check-word?word=unlikely')
        self.assertEqual(response.json['result'], 'not-on-board')

    def non_english_word(self):
        self.client.get('/')
        response = self.client.get('/check-word?word=asdasd')
        self.assertEqual(response.json['result'], 'not-word')