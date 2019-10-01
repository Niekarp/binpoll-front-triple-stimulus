import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';
import { HttpClient } from '@angular/common/http';
import { ApiClientService } from '../api-client/api-client.service';
import { Subscription } from 'rxjs';
import { ConfigService } from 'src/app/services/config/config.service';
import { DataService } from '../data/data.service';


const AUDIO_SAMPLE_RATE = 44100;
const AUDIO_LENGTH_SECONDS = 7;
const AUDIO_NUM_OF_CHANNELS = 2;
const FADE_TIME_SECONDS = 0.005;

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private audioLastStartTime = 0;
  private raisedCosineEnvelopeFadeInOut: Float32Array;

  private currentlyPlayingSources: AudioBufferSourceNode[] = [];
  private currentlyPlayingAudioId: number = null;

  private audioPlayers: AudioPlayerSet;
  // { id: -1, samples: Array<Object[]>(), samplesNames: Array<string>() };
  private audioSet: {[setId: string]: any};
  private loaded = false;
  private pollLoadedCount = 0;
  private testLoadedCount = 0;

  private audioRequests = new Array<Subscription>();

  constructor(
      private http: HttpClient,
      private api: ApiClientService,
      private config: ConfigService,
      private data: DataService) {
    this.audioPlayers = new AudioPlayerSet(30);

    if ('webkitAudioContext' in window) {
      this.audioContext = new (window as any).webkitAudioContext();
    } else {
      this.audioContext = new AudioContext();
    }
    this.gainNode = this.audioContext.createGain();
    this.loadAudioPlayers();
  }

  // Loading audio

  public loadAudioPlayers(): void {
    if (this.loaded) { return; }
    this.loaded = true;
    this.testLoadedCount = 0;
    this.pollLoadedCount = 0;

    const baseUrl = '/assets/headphones-test-sounds/';

    const leftTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector2.wav';
    const rightTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector4.wav';
    const leftTestPlayer = this.audioPlayers.headphonesTestPlayers.get('left');
    const rightTestPlayer = this.audioPlayers.headphonesTestPlayers.get('right');

    this.loadTestAudioPlayer(leftTestUrl, leftTestPlayer);
    this.loadTestAudioPlayer(rightTestUrl, rightTestPlayer);

    this.generateRaisedCosineEnvelope(2 * FADE_TIME_SECONDS, AUDIO_SAMPLE_RATE);

    // download blobs
    this.api.getSampleSet().subscribe(audioSet => {
      this.audioSet = audioSet;
      this.data.seed = audioSet.seed;
      this.downloadAudioSet(audioSet);

      this.data.renewIntervalId = setInterval(() => {
        this.api.sendRenewRequest().subscribe(() => {}, error => clearInterval(this.data.renewIntervalId));
      }, 120000);
    });
  }

  public stopAudioLoading(): void {
    this.audioRequests.forEach((subscription: Subscription) => { subscription.unsubscribe(); });
  }

  public isAllTestAudioLoaded(): boolean {
    return (this.testLoadedCount === 2);
  }

  public isAllPollAudioLoaded(): boolean {
    return (this.pollLoadedCount === 30);
  }

  public getTestLoadingProgressPercentage(): number {
    return Math.floor((this.testLoadedCount / 2) * 100);
  }

  public getPollLoadingProgressPercentage(): number {
    return Math.floor((this.pollLoadedCount / 30) * 100);
  }

  public notifyOnAllTestAudioLoaded(onLoaded: () => void, onUpdate: () => void, onTimeout: () => void): void {
    const waitPeriod = 5;
    const waitEndTime = new Date();
    waitEndTime.setMinutes(waitEndTime.getMinutes() + waitPeriod);

    const intervalID = setInterval(() => {
      onUpdate();

      if (this.isAllTestAudioLoaded()) {
        clearInterval(intervalID);
        onLoaded();
      } else if (new Date() > waitEndTime) {
        clearInterval(intervalID);
        onTimeout();
      }
    }, 2000);
  }

  public notifyOnAllPollAudioLoaded(onLoaded: () => void, onUpdate: () => void, onTimeout: () => void): void {
    const waitPeriod = 5;
    const waitEndTime = new Date();
    waitEndTime.setMinutes(waitEndTime.getMinutes() + waitPeriod);

    const intervalID = setInterval(() => {
      onUpdate();

      if (this.isAllPollAudioLoaded()) {
        clearInterval(intervalID);
        onLoaded();
      } else if (new Date() > waitEndTime) {
        clearInterval(intervalID);
        onTimeout();
      }
    }, 2000);
  }

  // Audio data getters

  public get pollAudioSet(): { [setId: string]: any } {
    return this.audioSet;
  }

  public getSamplesName(): any[] {
    return this.audioSet['sampleNames'];
  }

  public getScenes(): Array<string[]> {
    const scenes = new Array<string[]>(10);

    for (let index = 0; index < scenes.length; ++index) {
      scenes[index] = (this.audioSet['samples'][index] as Array<{ url: string; scene: string }>)
        .map(variantObject => variantObject.scene);
    }

    return scenes;
  }

  // Audio control

  public play(audioIndex: number, variantIndex: number): void {
    this.audioContext.resume().then(() => {
      this.playAudioBuffer(this.audioPlayers.pollBuffers[audioIndex][variantIndex]);
      this.currentlyPlayingAudioId = variantIndex + 1;
    });
  }

  public pause(): void {
    const startTime = this.audioContext.currentTime;
    for (let i = 0; i < this.currentlyPlayingSources.length; ++i) {
      if (this.currentlyPlayingSources[i]) {
        this.currentlyPlayingSources[i].stop(startTime + FADE_TIME_SECONDS);
      }
      delete this.currentlyPlayingSources[i];
    }
    this.currentlyPlayingAudioId = null;
  }

  public isPlaying(variantIndex: number): boolean {
    if (this.currentlyPlayingAudioId === variantIndex) { return true; }
    return false;
  }

  // Headphones test audio

  public get headphonesTestLeftChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('left');
  }

  public get headphonesTestRightChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('right');
  }

  public pauseHeadphonesTestAudio(): void {
    this.audioPlayers.headphonesTestPlayers.get('left').pause();
    this.audioPlayers.headphonesTestPlayers.get('right').pause();
  }

  public toggleHeadphonesTestLeftChannelAudio(): boolean {
    return this.toggleAudio(this.audioPlayers.headphonesTestPlayers.get('left'));
  }

  public toggleHeadphonesTestRightChannelAudio(): boolean {
    return this.toggleAudio(this.audioPlayers.headphonesTestPlayers.get('right'));
  }

  private downloadAudioSet(audioSet: {[id: string]: any}): void {
    const samples: Array<object[]> = audioSet['samples'];

    for (let sample_i = 0; sample_i < samples.length; ++sample_i) {
      for (let sampleScene_i = 0; sampleScene_i < 3; ++sampleScene_i) {
        const request = this.api.getAudioBlob(samples[sample_i][sampleScene_i]['url'])
          .subscribe(arrayBufer => {
            this.audioContext.decodeAudioData(arrayBufer, (audioBuffer => {
              this.audioPlayers.pollBuffers[sample_i][sampleScene_i] = audioBuffer;
              this.pollLoadedCount += 1;
            }));
          });
        this.audioRequests.push(request);
      }
    }
  }

  private loadTestAudioPlayer(url: string, audio: HTMLAudioElement): void {
    const request = this.api.getAudioPlayer(url).subscribe(response => {
      const audioBlob = response;
      const audioUrl = URL.createObjectURL(audioBlob);

      audio.src = audioUrl;
      audio.load();

      this.testLoadedCount += 1;
    });

    this.audioRequests.push(request);
  }

  private playAudioBuffer(audioBuffer: AudioBuffer): void {
    // fade out -> fade in
    // this.gainNode.gain.cancelScheduledValues(startTime);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
    this.gainNode.gain.setValueCurveAtTime(this.raisedCosineEnvelopeFadeInOut, this.audioContext.currentTime, 2 * FADE_TIME_SECONDS);
    const startTime = this.audioContext.currentTime;
    let stopTime = startTime;

    if (this.currentlyPlayingSources.length > 0) {
      for (let i = 0; i < this.currentlyPlayingSources.length; ++i) {
        if (this.currentlyPlayingSources[i]) {
          this.currentlyPlayingSources[i].stop(startTime + FADE_TIME_SECONDS);
        }
      }
      stopTime = this.audioContext.currentTime;
      this.currentlyPlayingSources.length = 0;
    } else {
      this.audioLastStartTime = startTime;
    }

    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.currentlyPlayingSources.push(sourceNode);
    const offset = (stopTime - this.audioLastStartTime) % 7;
    sourceNode.loop = true;
    sourceNode.start(stopTime + FADE_TIME_SECONDS, offset);
  }

  private toggleAudio(audio: HTMLAudioElement): boolean {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    return !audio.paused;
  }

  private generateRaisedCosineEnvelope(lengthSeconds: number, sampleRate: number): void {
    const y = (x: number): number => 0.5 * (Math.cos(x) + 1);

    const numOfSamples = Math.ceil(lengthSeconds * sampleRate);
    this.raisedCosineEnvelopeFadeInOut = new Float32Array(numOfSamples);

    for (let i = 0; i < numOfSamples; ++i) {
      this.raisedCosineEnvelopeFadeInOut[i] = y(i / numOfSamples * 2 * Math.PI);
    }

    this.raisedCosineEnvelopeFadeInOut[0] = 1;
    this.raisedCosineEnvelopeFadeInOut[numOfSamples - 1] = 1;
  }
}
