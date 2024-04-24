from flask import Flask
from core import fmm_process

app = Flask(__name__)


@app.route("/api/submit/")
def submit():

    fmm_process.ffm_process()
    return {}
