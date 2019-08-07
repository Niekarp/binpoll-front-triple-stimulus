import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';
import { HttpClient } from '@angular/common/http'
import { ApiClientService } from '../api-client/api-client.service';
import { Subscription, of, Observable, throwError } from 'rxjs';
import { switchMap, retryWhen, delay, take, tap, map } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config/config.service';
import { DataService } from '../data/data.service';


const audioSampleRate = 44100;
const audioLengthSeconds = 7;
const audioNumOfChannels = 2;
const fadeTimeSeconds = 0.005;

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audioContext: AudioContext;
  private loaded = false;
  private currentlyPlayingSources: AudioBufferSourceNode[] = [];
  private gainNode: GainNode;
  private audioLastStartTime: number = 0;
  private raisedCosineEnvelopeFadeInOut: Float32Array;
  private currentlyPlayingAudioId: number = null;

  private audioPlayers: AudioPlayerSet;
  // { id: -1, samples: Array<Object[]>(), samplesNames: Array<string>() };
  private audioSet: {[id: string]: any};
  private pollLoadedCount = 0;
  private testLoadedCount = 0;

  private audioRequests = new Array<Subscription>();

  constructor(
      private http: HttpClient,
      private api: ApiClientService,
      private config: ConfigService,
      private data: DataService) {
    // console.log('audio service created');
    this.audioPlayers = new AudioPlayerSet(30);

    if('webkitAudioContext' in window) {
      this.audioContext = new (<any>window).webkitAudioContext();
    } else {
      this.audioContext = new AudioContext();
    }
    this.gainNode = this.audioContext.createGain();
    this.loadAudioPlayers();
  }

  // Loading audio

  public loadAudioPlayers(): void {
    if(this.loaded) { return; }
    this.loaded = true;
    this.testLoadedCount = 0;
    this.pollLoadedCount = 0;

    let baseUrl = '/assets/headphones-test-sounds/';

    let leftTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector2.wav';
    let rightTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector4.wav';
    let leftTestPlayer = this.audioPlayers.headphonesTestPlayers.get('left');
    let rightTestPlayer = this.audioPlayers.headphonesTestPlayers.get('right');

    this.loadTestAudioPlayer(leftTestUrl, leftTestPlayer);
    this.loadTestAudioPlayer(rightTestUrl, rightTestPlayer);

    this.generateRaisedCosineEnvelope(2 * fadeTimeSeconds, audioSampleRate);
    // console.log('raisedCosineEnvelopeFadeInOut');
    // console.log(this.raisedCosineEnvelopeFadeInOut);

    // download blobs
    this.api.getSampleSet().subscribe(audioSet => {
      // console.log(audioSet);
      this.audioSet = audioSet;
      this.data.seed = audioSet.seed;
      this.config.getConfig().subscribe(config => {
        this.downloadAudioSet(audioSet, config['pollSoundsUrl']);
      });
    }, error => {
    });
  }
  
  public stopAudioLoading(): void {
    this.audioRequests.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
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
    let waitPeriod = 5;
    let waitEndTime = new Date();
    waitEndTime.setMinutes(waitEndTime.getMinutes() + waitPeriod);

    let intervalID = setInterval(() => {
      onUpdate();

      if (this.isAllTestAudioLoaded()) {
        clearInterval(intervalID);
        onLoaded();
      }
      else if (new Date() > waitEndTime) {
        clearInterval(intervalID);
        onTimeout();
      }
    }, 2000);
  }

  public notifyOnAllPollAudioLoaded(onLoaded: () => void, onUpdate: () => void, onTimeout: () => void): void {
    let waitPeriod = 5;
    let waitEndTime = new Date();
    waitEndTime.setMinutes(waitEndTime.getMinutes() + waitPeriod);

    let intervalID = setInterval(() => {
      onUpdate();

      if (this.isAllPollAudioLoaded()) {
        clearInterval(intervalID);
        onLoaded();
      }
      else if (new Date() > waitEndTime) {
        clearInterval(intervalID);
        onTimeout();
      }
    }, 2000);
  }

  // Audio data getters

  public get pollAudioSet(): { [id: string]: any } {
    return this.audioSet;
  }

  public getSamplesName (): any[] {
    return this.audioSet['sampleNames'];
  }

  public getScenes(): Array<string[]> {
    let scenes = new Array<string[]>(10);
	
    for (let index = 0; index < scenes.length; ++index) {
      scenes[index] = (this.audioSet['samples'][index] as Array<{ url: string, scene: string }>)
        .map(variantObject => variantObject.scene);
    };
	
	  return scenes;
  }

  // Audio control

  public play(audioIndex: number, variantIndex: number): void {
    this.audioContext.resume().then(() => {
      // this.currentlyPlayingAudioId = index + 1;
      this.playAudioBuffer(this.audioPlayers.pollBuffers[audioIndex][variantIndex]);
      this.currentlyPlayingAudioId = variantIndex + 1;
    });
  }

  public pause(): void {
    let startTime = this.audioContext.currentTime;
    for(let i = 0; i < this.currentlyPlayingSources.length; ++i) {
      if(this.currentlyPlayingSources[i]) { 
        this.currentlyPlayingSources[i].stop(startTime + fadeTimeSeconds);
      }
      delete this.currentlyPlayingSources[i];
    }
    this.currentlyPlayingAudioId = null;
  }

  public isPlaying(variantIndex: number): boolean {
    if (this.currentlyPlayingAudioId === variantIndex) return true;
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

  private downloadAudioSet(audioSet: {[id: string]: any}, baseUrl: string) {
    let samples: Array<object[]> = audioSet['samples'];
    let sampleNames: Array<string> = audioSet['sampleNames'];

    // console.log(samples);
    // console.log(sampleNames);

    for(let sample_i = 0; sample_i < samples.length; ++sample_i) {
      for(let sampleScene_i = 0; sampleScene_i < 3; ++sampleScene_i) {
        this.loadAudioBlob(samples[sample_i][sampleScene_i]['url']).subscribe(arrayBufer => {
          this.audioContext.decodeAudioData(arrayBufer, (audioBuffer => {
            // console.log('downloaded: ', samples[sample_i][sampleScene_i]);
            this.audioPlayers.pollBuffers[sample_i][sampleScene_i] = audioBuffer;
            this.pollLoadedCount += 1; 
            // console.log('poll loaded audio count: ' + this.pollLoadedCount); 
          }), err => {
            console.error('audio download error');
            console.error(err);
          });
        });
      }
    }
  }

  private loadAudioBlob(url: string): Observable<ArrayBuffer> {
    return this.http.get(url, {responseType: 'arraybuffer'}).pipe(retryWhen(errors => {
      if (!this.data.redownloadStarted) {
        this.data.redownloadStarted = true;
        console.warn('retrying audio download started');
      }
      let downloadCount = 0;
      return errors.pipe(
          tap(error => {
            downloadCount += 1;
            if (downloadCount >= this.data.redownloadCount) {
              console.warn(`could not download audio(attempt ${downloadCount})`);
              console.error(error);
              this.data.redownloadCount += 1;
            }
            if (downloadCount >= 10) {
              throw 'could not download audio after 10 attempts';
            }
          }),
          delay(25000));
    }));
  }

  private loadTestAudioPlayer(url: string, audio: HTMLAudioElement): void {
    this.loadAudioPlayer(url, audio, () => { 
      this.testLoadedCount += 1;
      // console.log('headset-test loaded audio count: ' + this.testLoadedCount); 
    });
  }

  private loadAudioPlayer(url: string, audio: HTMLAudioElement, onLoaded: () => void): void {
    const request = this.http.get(url, {responseType: 'blob'}).subscribe(response => {
      let audioBlob = response;
      let audioUrl = URL.createObjectURL(audioBlob);
      // console.log('audio loaded: ' + audioUrl);
      audio.src = audioUrl;
      audio.load();
      
      onLoaded();
    });

    this.audioRequests.push(request);
  }

  private playAudioBuffer(audioBuffer: AudioBuffer): void {
    // fade out -> fade in
    //this.gainNode.gain.cancelScheduledValues(startTime);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
    this.gainNode.gain.setValueCurveAtTime(this.raisedCosineEnvelopeFadeInOut, this.audioContext.currentTime, 2 * fadeTimeSeconds);
    let startTime = this.audioContext.currentTime;
    let stopTime = startTime;

    if(this.currentlyPlayingSources.length > 0) {
      for(let i = 0; i < this.currentlyPlayingSources.length; ++i) {
        if(this.currentlyPlayingSources[i]) { 
          this.currentlyPlayingSources[i].stop(startTime + fadeTimeSeconds);
        }
      }
      stopTime = this.audioContext.currentTime;
      this.currentlyPlayingSources.length = 0;
    } else {
      this.audioLastStartTime = startTime;
    }

    let sourceNode = this.audioContext.createBufferSource();
    //sourceNode.onended = () => {console.log("end");};
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.currentlyPlayingSources.push(sourceNode);
    let offset = (stopTime - this.audioLastStartTime) % 7;
    sourceNode.loop = true;
    sourceNode.start(stopTime + fadeTimeSeconds, offset);
  }

  private toggleAudio(audio: HTMLAudioElement): boolean {
    if (audio.paused) audio.play();
    else audio.pause();
    return !audio.paused;
  }

  private generateRaisedCosineEnvelope(lengthSeconds:number, sampleRate:number): void {
    let y = (x:number) => 0.5 * (Math.cos(x) + 1);

    let numOfSamples = Math.ceil(lengthSeconds * sampleRate);
    this.raisedCosineEnvelopeFadeInOut = new Float32Array(numOfSamples);

    for(let i = 0; i < numOfSamples; ++i) {
      this.raisedCosineEnvelopeFadeInOut[i] = y(i / numOfSamples * 2 * Math.PI);
    }

    this.raisedCosineEnvelopeFadeInOut[0] = 1;
    this.raisedCosineEnvelopeFadeInOut[numOfSamples - 1] = 1;
  }
}
