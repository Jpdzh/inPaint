import base64
import io
import os
from io import BytesIO
import cv2
import numpy as np
import yaml
from PIL import Image


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


# def resize_image_and_convert_to_base64(base64_string):
#     # 将base64字符串解码为图像
#     img_data = base64.b64decode(base64_string)
#     img = Image.open(io.BytesIO(img_data))
#
#     # 将图像大小调整为256x256
#     img = img.resize((256, 256))
#
#     # 将图像转换为base64格式
#     buffered = io.BytesIO()
#     img.save(buffered, format="PNG")
#     img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
#
#     return img_base64


def resize_image_and_convert_to_base64(base64_str):
    # 将base64字符串解码为图像
    image_data = base64.b64decode(base64_str)
    image = Image.open(BytesIO(image_data))

    # 计算长边的比例
    width, height = image.size
    if width > height:
        ratio = 256 / width
    else:
        ratio = 256 / height

    # 裁剪图像使得长边为256
    new_width = int(width * ratio)
    new_height = int(height * ratio)
    image = image.resize((new_width, new_height))

    # 创建一个256x256的白色背景图像
    new_image = Image.new("RGB", (256, 256), "white")
    position = ((256 - new_width) // 2, (256 - new_height) // 2)
    new_image.paste(image, position)

    # 将调整大小后的图像转换为base64字符串
    buffered = BytesIO()
    new_image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return img_str
