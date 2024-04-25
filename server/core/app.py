from process import process
# 导入Flask
from flask import Flask, render_template
from utils import image_to_base64

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/inpaint', methods=['POST'])
def inpaint():
    # 获取前端传递的两张图片的 base64 数据
    # img_base64=request.form['']
    # mask_base64=request.form['']
    # 模拟拿到的图片
    b1 = image_to_base64('0010.png')
    b2 = image_to_base64('mask.png')
    response_data = process(b1, b2)

    # 返回处理后的结果
    return response_data


if __name__ == '__main__':
    app.run(debug=True)
