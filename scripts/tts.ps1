# Speaks a text file to a WAV with Windows' built-in System.Speech.
# Usage: powershell -File scripts/tts.ps1 -TextFile in.txt -OutFile out.wav [-Voice "Microsoft Hazel Desktop"] [-Rate 0]
param(
  [Parameter(Mandatory = $true)][string]$TextFile,
  [Parameter(Mandatory = $true)][string]$OutFile,
  [string]$Voice = 'Microsoft Hazel Desktop',
  [int]$Rate = 0
)

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try {
  $synth.SelectVoice($Voice)
  $synth.Rate = $Rate
  # 48 kHz 16-bit mono, which Remotion and ffmpeg handle without resampling surprises.
  $format = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(48000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
  $synth.SetOutputToWaveFile($OutFile, $format)
  $text = [System.IO.File]::ReadAllText($TextFile, [System.Text.Encoding]::UTF8)
  $synth.Speak($text)
} finally {
  $synth.SetOutputToNull()
  $synth.Dispose()
}
