# Transcribes a 16 kHz mono WAV with Windows' built-in speech recogniser
# (System.Speech dictation) and prints one JSON object per recognised phrase:
# {"text": ..., "startMs": ..., "endMs": ...}
# Usage: powershell -File scripts/transcribe-windows.ps1 -WavFile in.wav
param([Parameter(Mandatory = $true)][string]$WavFile)

Add-Type -AssemblyName System.Speech
$culture = New-Object System.Globalization.CultureInfo('en-GB')
$engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)
try {
  $engine.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))
  $engine.SetInputToWaveFile($WavFile)
  # Short pauses inside a sentence shouldn't end a phrase.
  $engine.EndSilenceTimeout = [TimeSpan]::FromMilliseconds(350)
  while ($true) {
    # Recognize() throws once the file is exhausted instead of returning null.
    try { $r = $engine.Recognize() } catch { break }
    if ($null -eq $r) { break }
    $start = [int]$r.Audio.AudioPosition.TotalMilliseconds
    $end = [int]($r.Audio.AudioPosition + $r.Audio.Duration).TotalMilliseconds
    [pscustomobject]@{ text = $r.Text; startMs = $start; endMs = $end } | ConvertTo-Json -Compress
  }
} finally {
  $engine.Dispose()
}
