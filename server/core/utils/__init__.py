import yaml
import os
from PIL import Image
import os
import base64
import io
import numpy as np
import cv2

def txtread(path):
    path = os.path.expanduser(path)
    with open(path, 'r') as f:
        return f.read()


def yamlread(path):
    return yaml.safe_load(txtread(path=path))


def imwrite(path=None, img=None):
    Image.fromarray(img).save(path)


def image_to_base64(image_path: str) -> str:
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
        base64_str = base64.b64encode(image_data).decode('utf-8')
    return base64_str


def base64_to_png(base64_str, save_dir):

    image_data = base64.b64decode(base64_str)
    img = Image.open(io.BytesIO(image_data))
    save_path = os.path.join(save_dir, '1.png')
    img.save(save_path, format="PNG")



def base64_to_cv2(base64_str, is_grey):
    # 解码 Base64 字符串为图像数据
    image_data = base64.b64decode(base64_str)

    # 将图像数据转换为 NumPy 数组
    nparr = np.frombuffer(image_data, np.uint8)

    # 使用 OpenCV 读取图像
    if is_grey:
        return cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    else:
        return cv2.imdecode(nparr, cv2.IMREAD_COLOR)


def numpy_to_base64(image_np):
    data = cv2.imencode('.jpg', image_np)[1]
    image_bytes = data.tobytes()
    image_base4 = base64.b64encode(image_bytes).decode('utf8')
    return image_base4
