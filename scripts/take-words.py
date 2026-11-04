# Word timings for line takes, with faster-whisper (small.en).
# Prints JSON: {"<file name>": [{"text", "startS", "endS"}, ...], ...}
# Each take is split at its pauses and every phrase is transcribed on its own,
# because Whisper can drop a one-word phrase ("Videos:") inside a longer take.
# Usage: <python with faster-whisper> scripts/take-words.py a.mp3 b.mp3 ...
import json
import os
import sys

import numpy as np
from faster_whisper import WhisperModel
from faster_whisper.audio import decode_audio

RATE = 16000
WINDOW = 320  # 20 ms
QUIET_DB = -45  # the takes are normalised to -14 LUFS first
MIN_PAUSE_S = 0.25

model = WhisperModel("small.en", device="cpu", compute_type="int8")


def quiet_windows(audio):
    n = len(audio) // WINDOW
    rms = np.sqrt(np.mean(audio[: n * WINDOW].reshape(n, WINDOW) ** 2, axis=1) + 1e-12)
    return 20 * np.log10(rms) < QUIET_DB


def phrases(audio):
    """(start, end) sample ranges of speech, split at pauses of MIN_PAUSE_S or more."""
    quiet = quiet_windows(audio)
    n = len(quiet)
    min_run = int(MIN_PAUSE_S * RATE / WINDOW)
    splits = []
    k = 0
    while k < n:
        if quiet[k]:
            j = k
            while j < n and quiet[j]:
                j += 1
            if j - k >= min_run and k > 0 and j < n:
                splits.append((k + j) // 2 * WINDOW)
            k = j
        else:
            k += 1
    bounds = [0] + splits + [len(audio)]
    return list(zip(bounds[:-1], bounds[1:]))


out = {}
for path in sys.argv[1:]:
    audio = decode_audio(path, sampling_rate=RATE)
    quiet = quiet_windows(audio)
    words = []
    for a, b in phrases(audio):
        segments, _ = model.transcribe(audio[a:b], word_timestamps=True, beam_size=5, language="en", vad_filter=False)
        phrase = [w for seg in segments for w in seg.words]
        # Whisper puts a phrase's first word at the phrase start (mid-pause);
        # move it to where the sound actually begins.
        k = a // WINDOW
        while k < len(quiet) - 1 and quiet[k]:
            k += 1
        onset = k * WINDOW / RATE
        for i, w in enumerate(phrase):
            start = a / RATE + w.start
            if i == 0:
                start = max(start, min(onset, a / RATE + w.end - 0.05))
            words.append({"text": w.word.strip(), "startS": round(start, 3), "endS": round(a / RATE + w.end, 3)})
    out[os.path.basename(path)] = words
print(json.dumps(out, indent=1))
