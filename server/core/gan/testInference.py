import sys
import os

import argparse
import json
import torch
import torchvision.transforms as transforms
from torchvision.utils import save_image
import numpy as np
from PIL import Image
from server.core.gan.models import CompletionNetwork
from server.core.gan.utils import poisson_blend, gen_input_mask




def main(args):
    args.model = os.path.expanduser(args.model)
    args.config = os.path.expanduser(args.config)
    args.input_img = os.path.expanduser(args.input_img)
    args.output_img = os.path.expanduser(args.output_img)

    # =============================================
    # Load model
    # =============================================
    with open(args.config, 'r') as f:
        config = json.load(f)
    mpv = torch.tensor(config['mpv']).view(1, 3, 1, 1)
    model = CompletionNetwork()
    model.load_state_dict(torch.load(args.model, map_location='cpu'))

    # =============================================
    # Predict
    # =============================================
    # convert img to tensor
    img = Image.open(args.input_img)
    img = transforms.Resize(args.img_size)(img)
    img = transforms.RandomCrop((args.img_size, args.img_size))(img)
    x = transforms.ToTensor()(img)
    x = torch.unsqueeze(x, dim=0)

    # create mask


    # mask = gen_input_mask(
    #     shape=(1, 1, x.shape[2], x.shape[3]),
    #     hole_size=(
    #         (args.hole_min_w, args.hole_max_w),
    #         (args.hole_min_h, args.hole_max_h),
    #     ),
    #     max_holes=args.max_holes,

    #使用free mask
    mask=Image.open(args.mask);

    mask=transforms.Resize(args.img_size)(mask)
    mask = transforms.RandomCrop((args.img_size, args.img_size))(mask)
    mask = transforms.ToTensor()(mask)
    mask = torch.unsqueeze(mask, dim=0)

    print(mask.shape)
    print(x.shape)

    # inpaint
    model.eval()
    with torch.no_grad():
        x_mask = x - x * mask + mpv * mask
        input = torch.cat((x_mask, mask), dim=1)
        output = model(input)
        inpainted = poisson_blend(x_mask, output, mask)
        # imgs = torch.cat((x, x_mask, inpainted), dim=0) # 把原图， masked， inpaint图像连接。
        imgs=inpainted

        os.makedirs(os.path.dirname(args.output_img), exist_ok=True)
        save_image(imgs, args.output_img, nrow=3)

    print('output img was saved as %s.' % args.output_img)



if __name__ == '__main__':
    args = parser.parse_args()
    main(args)
    print(sys.path)