
import base64
from PIL import Image
import json
from server.core.FMM_ImageInpainter import ImageInpainter
import cv2
import numpy as np


def numpy_to_base64(image_np):
    data = cv2.imencode('.jpg', image_np)[1]
    image_bytes = data.tobytes()
    image_base4 = base64.b64encode(image_bytes).decode('utf8')
    return image_base4

def base64_to_cv2(base64_str, is_grey):
    # 解码 Base64 字符串为图像数据
    image_data = base64.b64decode(base64_str)

    # 将图像数据转换为 NumPy 数组
    nparr = np.frombuffer(image_data, np.uint8)

    # 使用 OpenCV 读取图像
    if is_grey:
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    else:
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    return img

def ffm_process(img_base64, mask_base64):
    # 将 Base64 字符串转换为 OpenCV 图像
    img = base64_to_cv2(img_base64, False)
    mask = base64_to_cv2(mask_base64, True)

    inpainter = ImageInpainter(img)
    inpainter.inpaint(mask, 5)
    output=inpainter.getOutput()
    ouput_base64=numpy_to_base64(output)
    psnr=29.876


    response_data={
      'inpaint_img': ouput_base64,
      'psnr': psnr

    }
    return response_data
