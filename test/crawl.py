import requests

headers = {
    'cookie': '_ga=GA1.2.1231508168.1607601960; __snaker__id=x3469QQWgod9dhRc; _9755xjdesxxd_=32; _gid=GA1.2.1443608686.1609641634; gdxidpyhxdE=M92%5CA5sDuO%2F9ZUSdZ4KqWe2BeyyOPChqwMicj9cL8tIBGCv0WlP9i9ldP8xSzYtjj%2FZkerwJ6O4ny7RK6LBTsYqLU%2FmipDIooYVI6H6x%2F16QTQ6nvsrTOpQ34OrBc1BhZdZ%2BosOHj%5Cgc%2F%5CX%2B9iHDsBOv8PPGM9k7hdv6DrZiYxNUJx%2BO%3A1609767003436; PTASession=c46eafa2-d986-4ff7-bc52-85dce19c6eb9; _gat=1; JSESSIONID=8FE6C9A89AFA6D3B7E4896F42854AE96',
    'accept': 'application/json'
}
urls = ["https://pintia.cn/api/problem-sets/1339009895393476608/rankings?page=%s&limit=50" % i for i in range(0, 10)]
data = []
for url in urls:
    req = requests.get(url=url, headers = headers)
    j = req.json()
    ranks = j.get('commonRankings').get('commonRankings')
    for user in ranks:
        # print(user)
        u = user.get('user')
        sName = u.get('user').get('nickname')
        sId = u.get('studentUser').get('studentNumber')
        data.append(sId + "\n")
        pass
    pass

# 升序排列
data.sort()

print("人数：" + str(len(data)))
file_handle = open('data/student.txt', mode='w',encoding="utf-8")
file_handle.writelines(data)