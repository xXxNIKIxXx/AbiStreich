# coding=utf-8

from flask import Flask


def create_app():
    app = Flask(__name__)
    
    from Website.backend import backend

    app.register_blueprint(backend, url_prefix='/')
    
    return app