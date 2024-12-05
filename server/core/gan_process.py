import sys

import argparse
from turtle import st
import cv2
import os
from server.core.evaluation import calc_psnr, calc_ssim, calc_lpips
from server.core.gan import testInference
from server.core.utils import base64_to_cv2, resize_image_and_convert_to_base64, image_to_base64


def gan_process(img_base64: str, masked_base64: str):
    img_base64 = resize_image_and_convert_to_base64(img_base64)
    masked_base64 = resize_image_and_convert_to_base64(masked_base64)

    original_path = './server/core/data/datasets/gts/free/1.png'
    mask_path = './server/core/data/datasets/gt_keep_masks/free/1.png'
    inpainted_path = './server/core/log/gan_res/inpainted/1.png'

    original_img = base64_to_cv2(img_base64, 0)
    masked_img = base64_to_cv2(masked_base64, 0)

    # 将两张图像转换为灰度图
    original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
    masked_gray = cv2.cvtColor(masked_img, cv2.COLOR_BGR2GRAY)

    mask = cv2.absdiff(original_gray, masked_gray)
    _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)
    # mask = cv2.bitwise_not(mask)

    # 保存原图和 mask
    os.makedirs(os.path.dirname(original_path), exist_ok=True)
    cv2.imwrite(original_path, original_img)
    os.makedirs(os.path.dirname(mask_path), exist_ok=True)
    cv2.imwrite(mask_path, mask)

    # 添加配置
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--model',
        type=str,
        default='./server/core/gan/gan_model/model_cn_step400000')
    parser.add_argument('--config',
                        type=str,
                        default='./server/core/gan/config.json')
    parser.add_argument('--input_img', type=str, default=original_path)
    parser.add_argument('--output_img', type=str, default=inpainted_path)
    parser.add_argument('--mask', type=str, default=mask_path)
    parser.add_argument('--max_holes', type=int, default=5)
    parser.add_argument('--img_size', type=int, default=256)
    parser.add_argument('--hole_min_w', type=int, default=24)
    parser.add_argument('--hole_max_w', type=int, default=48)
    parser.add_argument('--hole_min_h', type=int, default=24)
    parser.add_argument('--hole_max_h', type=int, default=48)

    args = parser.parse_args()
    testInference.main(args)

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
