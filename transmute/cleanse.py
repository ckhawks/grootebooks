path = 'tweets.txt'

with open(path, encoding='utf8') as f:
    f = f.readlines()

arr = []

for line in f:
    words = line.split()
    sentence = ''
    for word in words:
        if 'https://' not in word:
            sentence += word + ' '
    
    if sentence.strip() != '':
        arr.append(sentence.strip())


with open('groot.txt', 'w', encoding='utf8') as f:
    for item in arr:
        f.write(item + '\n')
