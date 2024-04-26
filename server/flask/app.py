from enum import Enum
from re import sub
import typing
from flask import Flask, abort, request

from server.core.ddpm_process import ddpm_process
from server.core.fmm_process import fmm_process

app = Flask(__name__)


class Model(Enum):
    FMM = 'fmm'
    DDPM = 'ddpm'


class SubmitRequest:
    model: str
    img: str
    masked_img: str

    def __init__(self, model, img, masked_img):
        self.model = model
        self.img = img
        self.masked_img = masked_img

    @staticmethod
    def from_json(json_data: dict):
        model = json_data.get('model')
        img = json_data.get('img')
        masked_img = json_data.get('masked_img')
        if model is None or img is None or masked_img is None:
            return None
        return SubmitRequest(model, img, masked_img)


@app.route("/api/submit/")
def submit():
    submitRequst = SubmitRequest.from_json(request.get_json())

    if submitRequst is None:
        abort(400)

    if submitRequst.model == 'fmm':
        return fmm_process(submitRequst.img, submitRequst.masked_img)
    elif submitRequst.model == 'ddpm':
        return ddpm_process(submitRequst.img, submitRequst.masked_img)
    else:
        abort(400)


if __name__ == '__main__':
    app.run(debug=True)
