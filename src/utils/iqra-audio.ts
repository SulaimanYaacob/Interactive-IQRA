export function playIqra1Audio(word: string) {
  const path = "/audio/";
  let audio: HTMLAudioElement;

  if (word === "=" || word === "-") return null;

  if (word === "ءَ") audio = new Audio(`${path}أَ.wav`);
  else if (word === "ﻣَ") audio = new Audio(`${path}مَ.wav`);
  else audio = new Audio(`${path}${word}.wav`);

  return audio.play();
}
