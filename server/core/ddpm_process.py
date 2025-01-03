import os
from server.core.test import main  # 导入test.py中的main函数
import conf_mgt
from utils import yamlread
from utils import image_to_base64
from server.core.utils import base64_to_cv2, resize_image_and_convert_to_base64
import cv2
from server.core.evaluation import calc_psnr, calc_ssim, calc_lpips


def ddpm_process(img_base64: str, masked_base64: str):
    img_base64 = resize_image_and_convert_to_base64(img_base64)
    masked_base64 = resize_image_and_convert_to_base64(masked_base64)

    conf_path = './server/core/confs/my_schedule.yml'
    conf = conf_mgt.conf_base.Default_Conf()
    conf.update(yamlread(conf_path))


    original_path = './server/core/data/datasets/gts/free/1.png'
    mask_path = './server/core/data/datasets/gt_keep_masks/free/1.png'
    inpainted_path = './server/core/log/ddpm_res/inpainted/1.png'

    original_img = base64_to_cv2(img_base64, 0)
    masked_img = base64_to_cv2(masked_base64, 0)

    # 将两张图像转换为灰度图
    original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
    masked_gray = cv2.cvtColor(masked_img, cv2.COLOR_BGR2GRAY)

    mask = cv2.absdiff(original_gray, masked_gray)
    _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)
    mask = cv2.bitwise_not(mask)

    # 保存原图和 mask
    os.makedirs(os.path.dirname(original_path), exist_ok=True)
    cv2.imwrite(original_path, original_img)
    os.makedirs(os.path.dirname(mask_path), exist_ok=True)
    cv2.imwrite(mask_path, mask)

    main(conf)
    os.makedirs(os.path.dirname(inpainted_path), exist_ok=True)
    inpainted_img_base64 = image_to_base64(inpainted_path)

    #评估指标
    ssim_score = calc_ssim(original_path, inpainted_path)
    psnr_score = calc_psnr(original_path, inpainted_path)
    lpips_score = calc_lpips(original_path, inpainted_path)

    response_data = {
        'model': 'ddpm',  #模型
        'original_img': img_base64,  #原图
        'masked_img': masked_base64,  #masked
        'inpainted_img': inpainted_img_base64,  #修复后
        'psnr': psnr_score,  #指标
        'ssmi': ssim_score,
        'lpips': lpips_score
    }
    return response_data
