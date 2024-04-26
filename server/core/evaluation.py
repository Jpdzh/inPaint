from skimage.metrics import structural_similarity as ssim
import numpy as np
from skimage.metrics import peak_signal_noise_ratio as psnr
import lpips
import torch
import torchvision.transforms as transforms
from PIL import Image
import cv2


def calc_ssim(img1_path, img2_path):
    img1 = Image.open(img1_path).convert('L')
    img2 = Image.open(img2_path).convert('L')
    img2 = img2.resize(img1.size)
    img1, img2 = np.array(img1), np.array(img2)
    # 此处因为转换为灰度值之后的图像范围是0-255，所以data_range为255，如果转化为浮点数，且是0-1的范围，则data_range应为1
    ssim_score = ssim(img1, img2, data_range=255)
    return ssim_score


def calc_psnr(img1_path, img2_path):
    img1 = Image.open(img1_path)
    img2 = Image.open(img2_path)
    img2 = img2.resize(img1.size)
    img1, img2 = np.array(img1), np.array(img2)
    # 此处的第一张图片为真实图像，第二张图片为测试图片
    # 此处因为图像范围是0-255，所以data_range为255，如果转化为浮点数，且是0-1的范围，则data_range应为1
    psnr_score = psnr(img1, img2, data_range=255)
    return psnr_score


def calc_lpips(img1_path, img2_path):
    loss_fn_alex = lpips.LPIPS(net='alex')
    img1 = cv2.imread(img1_path)
    img2 = cv2.imread(img2_path)

    transf = transforms.ToTensor()

    t1 = transf(img1)
    t2 = transf(img2)

    t1d = t1.to(torch.float32)
    t2d = t2.to(torch.float32)

    res = loss_fn_alex(t1d, t2d).item()
    return res
