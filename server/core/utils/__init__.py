# Copyright (c) 2022 Huawei Technologies Co., Ltd.
# Licensed under CC BY-NC-SA 4.0 (Attribution-NonCommercial-ShareAlike 4.0 International) (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
#
# The code is released for academic research use only. For commercial use, please contact Huawei Technologies Co., Ltd.
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# This repository was forked from https://github.com/openai/guided-diffusion, which is under the MIT license

import yaml
import os
from PIL import Image
import os
import base64
import io

def txtread(path):
    path = os.path.expanduser(path)
    with open(path, 'r') as f:
        return f.read()

# def txtread(path, encoding='utf-8'):
#     path = os.path.expanduser(path)
#     with open(path, 'r',encoding=encoding) as f:
#         return f.read()

def yamlread(path):
    return yaml.safe_load(txtread(path=path))

def imwrite(path=None, img=None):
    Image.fromarray(img).save(path)



def image_to_base64(image_path):
    with open(image_path, 'rb') as image_file:
        image_data = image_file.read()
        base64_str = base64.b64encode(image_data).decode('utf-8')
    return base64_str

def base64_to_png(base64_str, save_dir):

    image_data = base64.b64decode(base64_str)
    img = Image.open(io.BytesIO(image_data))
    save_path=os.path.join(save_dir, '1.png')
    img.save(save_path, format="PNG")

