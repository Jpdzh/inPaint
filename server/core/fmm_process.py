import base64
from typing import Any
from PIL import Image
import json
from server.core.FMM_ImageInpainter import ImageInpainter
import cv2
from server.core.utils import base64_to_cv2, numpy_to_base64, resize_image_and_convert_to_base64
from server.core.evaluation import calc_psnr, calc_ssim, calc_lpips


def fmm_process(img_base64: str, masked_base64: str):

    img_base64 = resize_image_and_convert_to_base64(img_base64)
    masked_base64 = resize_image_and_convert_to_base64(masked_base64)

    
    original_path='D://log/fmm_res/original.png'
    inpainted_path='D://log/fmm_res/inpainted.png'

    original_img = base64_to_cv2(img_base64, 0)
    masked_img = base64_to_cv2(masked_base64, 0)
    cv2.imwrite(original_path, original_img)

    # 将两张图像转换为灰度图
    original_gray = cv2.cvtColor(original_img, cv2.COLOR_BGR2GRAY)
    masked_gray = cv2.cvtColor(masked_img, cv2.COLOR_BGR2GRAY)

    #提取mask
    mask = cv2.absdiff(original_gray, masked_gray)
    _, mask = cv2.threshold(mask, 30, 255, cv2.THRESH_BINARY)

    inpainter = ImageInpainter(original_img)
    inpainter.inpaint(mask, 5)
    inpainted_img = inpainter.getOutput()

    cv2.imwrite(inpainted_path, inpainted_img)

    ssim_score = calc_ssim(original_path, inpainted_path)
    psnr_score = calc_psnr(original_path, inpainted_path)
    lpips_score = calc_lpips(original_path, inpainted_path)

    inpainted_base64 = numpy_to_base64(inpainted_img)

    response_data = {
        'model': 'fmm',
        'original_img': img_base64,
        'masked_img': masked_base64,
        'inpainted_img': inpainted_base64,
        'psnr': psnr_score,
        'ssmi': ssim_score,
        'lpips': lpips_score
    }
    return response_data
