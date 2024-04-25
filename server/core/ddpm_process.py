import sys

from server.core.test import main  # 导入test.py中的main函数
import conf_mgt
from utils import yamlread
from utils import image_to_base64
from server.core.utils import base64_to_cv2
import cv2
from server.core.evaluation import calc_psnr, calc_ssim, calc_lpips
def ddpm_process(img_base64: str, masked_base64: str):
    conf_path = '../core/confs/my_schedule.yml'
    conf = conf_mgt.conf_base.Default_Conf()
    conf.update(yamlread(conf_path))

    original_path='../core/data/datasets/gts/free/1.png'
    mask_path='../core/data/datasets/gt_keep_masks/free/1.png'
    inpainted_path='../core/log/test_free/inpainted/1.png'

    original_img = base64_to_cv2(img_base64, 0)
    masked_img = base64_to_cv2(masked_base64, 0)

    # 将两张图像转换为灰度图
    original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
    masked_gray = cv2.cvtColor(masked_img, cv2.COLOR_BGR2GRAY)

    mask = cv2.absdiff(original_gray, masked_gray)
    _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)
    mask = cv2.bitwise_not(mask)

    # 保存原图和 mask
    cv2.imwrite(original_path, original_img)
    cv2.imwrite(mask_path, mask)


    main(conf)
    inpainted_img_base64 = image_to_base64(inpainted_path)

    #评估指标
    ssim_score = calc_ssim(original_path, inpainted_path)
    psnr_score = calc_psnr(original_path, inpainted_path)
    lpips_score = calc_lpips(original_path, inpainted_path)

    response_data = {
        'model': 'DDPM',                        #模型
        'original_img': img_base64,             #原图
        'masked_img': masked_base64,            #masked
        'inpainted_img': inpainted_img_base64,  #修复后
        'psnr': psnr_score,                     #指标
        'ssmi': ssim_score,
        'lpips': lpips_score
    }
    return response_data
