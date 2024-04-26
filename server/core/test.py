import os

import sys

sys.path.insert(0, 'D:\\temp\\inPaint02\\server\\core')

import os
import torch as th
import torch.nn.functional as F
import conf_mgt
from guided_diffusion import dist_util

from utils import yamlread
import base64
import io
from PIL import Image

# Workaround
try:
    import ctypes
    libgcc_s = ctypes.CDLL('libgcc_s.so.1')
except:
    pass

from guided_diffusion.script_util import (
    NUM_CLASSES,
    model_and_diffusion_defaults,
    classifier_defaults,
    create_model_and_diffusion,
    create_classifier,
    select_args,
)  # noqa: E402


def toU8(sample):
    if sample is None:
        return sample

    sample = ((sample + 1) * 127.5).clamp(0, 255).to(th.uint8)
    sample = sample.permute(0, 2, 3, 1)
    sample = sample.contiguous()
    sample = sample.detach().cpu().numpy()
    return sample


def main(conf: conf_mgt.Default_Conf):

    print("Start", conf['name'])

    device = dist_util.dev(conf.get('device'))

    model, diffusion = create_model_and_diffusion(**select_args(
        conf,
        model_and_diffusion_defaults().keys()),
                                                  conf=conf)
    model.load_state_dict(
        dist_util.load_state_dict(os.path.expanduser(conf.model_path),
                                  map_location="cpu"))
    model.to(device)
    if conf.use_fp16:
        model.convert_to_fp16()
    model.eval()

    show_progress = conf.show_progress

    if conf.classifier_scale > 0 and conf.classifier_path:
        print("loading classifier...")
        classifier = create_classifier(
            **select_args(conf,
                          classifier_defaults().keys()))
        classifier.load_state_dict(
            dist_util.load_state_dict(os.path.expanduser(conf.classifier_path),
                                      map_location="cpu"))

        classifier.to(device)
        if conf.classifier_use_fp16:
            classifier.convert_to_fp16()
        classifier.eval()

        def cond_fn(x, t, y=None, gt=None, **kwargs):
            assert y is not None
            with th.enable_grad():
                x_in = x.detach().requires_grad_(True)
                logits = classifier(x_in, t)
                log_probs = F.log_softmax(logits, dim=-1)
                selected = log_probs[range(len(logits)), y.view(-1)]
                return th.autograd.grad(selected.sum(),
                                        x_in)[0] * conf.classifier_scale
    else:
        cond_fn = None

    def model_fn(x, t, y=None, gt=None, **kwargs):
        assert y is not None
        return model(x, t, y if conf.class_cond else None, gt=gt)

    print("sampling...")
    all_images = []

    dset = 'eval'

    eval_name = conf.get_default_eval_name()

    dl = conf.get_dataloader(dset=dset, dsName=eval_name)

    for batch in iter(dl):

        for k in batch.keys():
            if isinstance(batch[k], th.Tensor):
                batch[k] = batch[k].to(device)

        model_kwargs = {}

        model_kwargs["gt"] = batch['GT']

        gt_keep_mask = batch.get('gt_keep_mask')
        if gt_keep_mask is not None:
            model_kwargs['gt_keep_mask'] = gt_keep_mask

        batch_size = model_kwargs["gt"].shape[0]

        if conf.cond_y is not None:
            classes = th.ones(batch_size, dtype=th.long, device=device)
            model_kwargs["y"] = classes * conf.cond_y
        else:
            classes = th.randint(low=0,
                                 high=NUM_CLASSES,
                                 size=(batch_size, ),
                                 device=device)
            model_kwargs["y"] = classes

        sample_fn = (diffusion.p_sample_loop
                     if not conf.use_ddim else diffusion.ddim_sample_loop)

        result = sample_fn(model_fn,
                           (batch_size, 3, conf.image_size, conf.image_size),
                           clip_denoised=conf.clip_denoised,
                           model_kwargs=model_kwargs,
                           cond_fn=cond_fn,
                           device=device,
                           progress=show_progress,
                           return_all=True,
                           conf=conf)
        srs = toU8(result['sample'])
        gts = toU8(result['gt'])
        lrs = toU8(
            result.get('gt') * model_kwargs.get('gt_keep_mask') +
            (-1) * th.ones_like(result.get('gt')) *
            (1 - model_kwargs.get('gt_keep_mask')))

        gt_keep_masks = toU8((model_kwargs.get('gt_keep_mask') * 2 - 1))

        conf.eval_imswrite(srs=srs,
                           gts=gts,
                           lrs=lrs,
                           gt_keep_masks=gt_keep_masks,
                           img_names=batch['GT_name'],
                           dset=dset,
                           name=eval_name,
                           verify_same=False)

    print("sampling complete")


#
# if __name__ == "__main__":
#     conf_path= 'confs/my_schedule.yml'
#     conf_arg = conf_mgt.conf_base.Default_Conf()
#     conf_arg.update(yamlread(conf_path))
#     main(conf_arg)


def image_to_base64(image_path):
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
        base64_str = base64.b64encode(image_data).decode('utf-8')
    return base64_str


def run_main(img_base64, mask_base64):
    print('run main hhh')
    conf_path = 'confs/my_schedule.yml'
    conf_arg = conf_mgt.conf_base.Default_Conf()
    conf_arg.update(yamlread(conf_path))
    main(conf_arg)


if __name__ == "__main__":
    b1 = image_to_base64('0009.png')
    b2 = image_to_base64('mask.png')

    run_main(b1, b2)
