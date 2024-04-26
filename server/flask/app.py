from flask import Flask, abort, request

from server.core.ddpm_process import ddpm_process
from server.core.fmm_process import fmm_process

app = Flask(__name__)


@app.route("/api/submit/")
def submit():
    req = request.get_json()
    model = req['model']
    match model:
        case 'fmm':
            return fmm_process(req['img'], req['masked_img'])
        case 'ddpm':
            return ddpm_process(req['img'], req['masked_img'])
        case _:
            abort(400)
