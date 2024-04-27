from enum import Enum
from flask import Flask, abort, jsonify, make_response, request
from flask_cors import CORS

from server.core.ddpm_process import ddpm_process
from server.core.fmm_process import fmm_process

app = Flask(__name__)
CORS(app)


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


@app.route("/api/submit", methods=["POST", "OPTIONS"])
def submit():
    if request.method == "OPTIONS":
        return _build_cors_preflight_response()

    submitRequest = SubmitRequest.from_json(request.get_json())

    if submitRequest is None:
        abort(400)

    def switch():
        if submitRequest.model == 'fmm':
            return fmm_process(submitRequest.img, submitRequest.masked_img)
        elif submitRequest.model == 'ddpm':
            return ddpm_process(submitRequest.img, submitRequest.masked_img)

    switched = switch()

    if switched is None:
        abort(400)

    return _corsify_actual_response(jsonify(switched))


def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == '__main__':
    app.run(debug=True)
