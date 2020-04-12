import numpy as np
import keras
import random


def sample(preds, temperature=1):
    # helper function to sample an index from a probability array
    preds = np.asarray(preds).astype('float64')
    preds = np.log(preds) / temperature
    exp_preds = np.exp(preds)
    preds = exp_preds / np.sum(exp_preds)
    probas = np.random.multinomial(1, preds, 1)
    return np.argmax(probas)


def generate_text(length, diversity, text, char_indices, indices_char, model, chars):
    maxlen = 40
    step = 3
    # Get random starting text
    start_index = random.randint(0, len(text) - maxlen - 1)
    generated = ''
    sentence = text[start_index: start_index + maxlen]
    generated += sentence
    for i in range(length):
            x_pred = np.zeros((1, maxlen, len(chars)))
            for t, char in enumerate(sentence):
                x_pred[0, t, char_indices[char]] = 1.

            preds = model.predict(x_pred, verbose=0)[0]
            next_index = sample(preds, diversity)
            next_char = indices_char[next_index]

            generated += next_char
            sentence = sentence[1:] + next_char
    return generated


def generate():
    WEIGHT_FILE = 'groot.hdf5'
    TEXT_FILE = 'groot.txt'
    model = keras.models.load_model(WEIGHT_FILE)
    model.summary()

    text = open(TEXT_FILE, 'r', encoding='utf8').read().lower()
    chars = sorted(list(set(text)))
    char_indices = dict((c, i) for i, c in enumerate(chars))
    indices_char = dict((i, c) for i, c in enumerate(chars))

    char_length = random.randint(50, 140)
    temp_arr = [.7, .8, .9, 1]
    text = generate_text(char_length, random.choice(temp_arr), text, char_indices, indices_char, model, chars)
    if '\n' not in text:
        text += '\n'
    return text


def main():
    text_arr = []
    for i in range(1000):
        text_arr.append(generate())
        print(i)

    with open('TWEET.txt', 'w', encoding='utf8') as f:
        for text in text_arr:
            f.write(text)

main()