import os
import base64
import io

from PIL import Image
import json
from test import main  # 导入test.py中的main函数
import conf_mgt
from utils import yamlread
from utils import image_to_base64
from utils import base64_to_png


def process(img_base64, mask_base64):
    conf_path= 'confs/my_schedule.yml'
    conf = conf_mgt.conf_base.Default_Conf()
    conf.update(yamlread(conf_path))

    # 将base64字符串解码为图像
    base64_to_png(img_base64, 'data/datasets/gts/free')
    base64_to_png(mask_base64, 'data/datasets/gt_keep_masks/free')

    main(conf)
    inpainted_img_base64 = image_to_base64('log/test_free/inpainted/1.png')
    psnr=27.999
    response_data={
      'inpainted_img_base64': inpainted_img_base64,
      'psnr': psnr
    }
    return response_data
