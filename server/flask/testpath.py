import time
import os
import sys

# path = os.path.abspath(os.path.dirname(sys.argv[0]))

# localtime = time.localtime(time.time())#获取当前时间
# time = time.strftime('%Y%m%d%H%M%S',time.localtime(time.time()))#把获取的时间转换成"年月日格式”
# print(time)
# b = "我在做测试"

# with open(path+'\\'+str(time) +'.txt', 'a',encoding='utf-8') as w:
#     w.write(b)
#     w.close()
print(sys.path)

# 获得根路径
def getRootPath():
    # 获取文件目录
    curPath = os.path.abspath(os.path.dirname(__file__))
    # 获取项目根路径，内容为当前项目的名字
    rootPath = curPath[:curPath.find('inPaint')+len('inPaint')]
    return  rootPath

print(getRootPath() )

