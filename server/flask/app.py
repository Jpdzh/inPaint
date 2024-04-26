from flask import Flask

app = Flask(__name__)


@app.route("/api/submit/")
def submit():

    return {}
