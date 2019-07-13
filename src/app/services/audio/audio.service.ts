import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ApiClientService } from '../api-client/api-client.service';
import { Subscription, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CompilerConfig } from '@angular/compiler';
import { ConfigService } from 'src/app/config/config.service';


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
  private audioBuffers: AudioBuffer[] = [];
  private gainNode: GainNode;
  private audioLastStartTime: number = 0;
  private raisedCosineEnvelopeFadeInOut: Float32Array;
  private currentlyPlayingAudioId: number = null;

  // OLD
  private audioPlayers: AudioPlayerSet;
  private audioSet: {[id: string]: any}; // { id: -1, samples: Array<Object[]>(), samplesNames: Array<string>() };
  private pollLoadedCount = 0;
  private testLoadedCount = 0;

  private audioRequests = new Array<Subscription>();
  // OLD END  

  constructor(private http: HttpClient, private api: ApiClientService, private config: ConfigService) {
    // OLD
    this.audioPlayers = new AudioPlayerSet(30);
    // NEW
    // console.log('audio service created');
    if('webkitAudioContext' in window) {
      this.audioContext = new (<any>window).webkitAudioContext();
    }
    else {
      this.audioContext = new AudioContext();
    }
    //this.sourceNodes = [];
    this.gainNode = this.audioContext.createGain();
    this.loadAudioPlayers();
  }

  // load audio methods
  public loadAudioPlayers() {
    if(this.loaded) {
      return;
    }
    this.loaded = true;
    this.testLoadedCount = 0;
    this.pollLoadedCount = 0;

    let baseUrl = '/assets/headphones test sounds/';

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

      this.config.getConfig().subscribe(config => {
        this.downloadAudioSet(audioSet, config['pollSoundsUrl']);
      });
    });
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

  private generateRaisedCosineEnvelope(lengthSeconds:number, sampleRate:number) {
    let y = (x:number) => 0.5 * (Math.cos(x) + 1);

    let numOfSamples = Math.ceil(lengthSeconds * sampleRate);
    this.raisedCosineEnvelopeFadeInOut = new Float32Array(numOfSamples);

    for(let i = 0; i < numOfSamples; ++i) {
      this.raisedCosineEnvelopeFadeInOut[i] = y(i / numOfSamples * 2 * Math.PI);
    }

    this.raisedCosineEnvelopeFadeInOut[0] = 1;
    this.raisedCosineEnvelopeFadeInOut[numOfSamples - 1] = 1;
  }

  private loadAudioBlob(url: string): Observable<ArrayBuffer> {
    const request = this.http.get(url, {responseType: 'arraybuffer'}).pipe(switchMap(response => {   
      return of(response);  
    }));
    return request;
  }

  private playAudioBuffer(audioBuffer: AudioBuffer) {
    // fade out -> fade in
    //this.gainNode.gain.cancelScheduledValues(startTime);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime);
    this.gainNode.gain.setValueCurveAtTime(this.raisedCosineEnvelopeFadeInOut, this.audioContext.currentTime, 2 * fadeTimeSeconds);
    let startTime = this.audioContext.currentTime;
    let stopTime = startTime;

    if(this.currentlyPlayingSources.length > 0) {
      for(let audioSource of this.currentlyPlayingSources) {
        audioSource.stop(startTime + fadeTimeSeconds);
        stopTime = this.audioContext.currentTime;
      }
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
  private stopAudioBuffer(audioBuffer: AudioBuffer) {

  }

  public play(audioIndex: number, variantIndex: number) {
    this.audioContext.resume().then(() => {
      // this.playAudioBuffer(this.audioBuffers[index]);
      // this.currentlyPlayingAudioId = index + 1;
      this.playAudioBuffer(this.audioPlayers.pollBuffers[audioIndex][variantIndex]);
      this.currentlyPlayingAudioId = variantIndex + 1;
    });
  }

  public pause() {
    let startTime = this.audioContext.currentTime;
    for(let audioSource of this.currentlyPlayingSources) {
      audioSource.stop(startTime + fadeTimeSeconds);
    }
    this.currentlyPlayingAudioId = null;
  }

  public isPlaying(variantIndex: number) {
    if (this.currentlyPlayingAudioId === variantIndex) return true;
    return false;
  }

  public getScenes(): Array<string[]> {
    let scenes = new Array<string[]>(10);
	
    for (let index = 0; index < scenes.length; ++index) {
      scenes[index] = (this.audioSet['samples'][index] as Array<{ url: string, scene: string }>).map(variantObject => variantObject.scene);
    };
	
	  return scenes;
  }

  public getSamplesName () {
    return this.audioSet['sampleNames'];
  }

  // OLD

  // load audio methods
  public loadAudioPlayersOld() {
    if(this.loaded) {
      return;
    }
    this.loaded = true;
    this.testLoadedCount = 0;
    this.pollLoadedCount = 0;

    let baseUrl = '/assets/headphones test sounds/';

    let leftTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector2.wav';
    let rightTestUrl = baseUrl + 'Hungarian_1_hrtf4_sector4.wav';
    let leftTestPlayer = this.audioPlayers.headphonesTestPlayers.get('left');
    let rightTestPlayer = this.audioPlayers.headphonesTestPlayers.get('right');

    this.loadTestAudioPlayer(leftTestUrl, leftTestPlayer);
    this.loadTestAudioPlayer(rightTestUrl, rightTestPlayer);

    // get samples
    /* 
    this.api.getSampleSet().subscribe(audioSet => {
      this.audioSet.id = audioSet['id'];
      this.audioSet.samples = audioSet['samples'];
      
      // load poll samples audio
      for(let i = 0; i < this.audioPlayers.pollPlayers.length; ++i) {
        this.loadPollAudioPlayer(this.audioSet.samples[i], this.audioPlayers.pollPlayers[i]);
        this.audioPlayers.pollPlayers[i].loop = true;
      }
    });
    */
  }

  public stopAudioLoading() {
    this.audioRequests.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  public get pollAudioSet() {
    return this.audioSet;
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

  public notifyOnAllTestAudioLoaded(onLoaded: () => void, onUpdate: () => void, onTimeout: () => void) {
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

  public notifyOnAllPollAudioLoaded(onLoaded: () => void, onUpdate: () => void, onTimeout: () => void) {
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

  // headphones test audio methods
  public pauseHeadphonesTestAudio() {
    this.audioPlayers.headphonesTestPlayers.get('left').pause();
    this.audioPlayers.headphonesTestPlayers.get('right').pause();
  }

  public toggleHeadphonesTestLeftChannelAudio(): boolean {
    return this.toggleAudio(this.audioPlayers.headphonesTestPlayers.get('left'));
  }

  public toggleHeadphonesTestRightChannelAudio(): boolean {
    return this.toggleAudio(this.audioPlayers.headphonesTestPlayers.get('right'));
  }

  public get headphonesTestLeftChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('left');
  }

  public get headphonesTestRightChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('right');
  }

  // poll audio methods
  public togglePollAudio(audioIndex: number): boolean {
    return false;
    /* if (this.audioPlayers.pollPlayers[audioIndex].paused) {
      this.playPollAudio(audioIndex);
      return true;
    } else {
      this.audioPlayers.pollPlayers[audioIndex].pause();
      return false;
    } */
  }
/* 
  public playPollAudio(audioIndex: number) {
    this.pauseAllPollAudio();
    this.audioPlayers.pollPlayers[audioIndex].play();
    console.log('playing: ' + this.audioSet.samples[audioIndex].split('/').reverse()[0]);
  }

  public getPollAudio(audioIndex: number): HTMLAudioElement {
    return this.audioPlayers.pollPlayers[audioIndex];
  }

  public pauseAllPollAudio() {
    for(let audio of this.audioPlayers.pollPlayers) {
      audio.pause();
    }
  }

  public testAudio() { 
    console.log(this.audioPlayers.pollPlayers);
    this.audioPlayers.pollPlayers[29].play();
  } */

  private toggleAudio(audio: HTMLAudioElement): boolean {
    if (audio.paused) audio.play();
    else audio.pause();
    return !audio.paused;
  }

  private loadAudioPlayer(url: string, audio: HTMLAudioElement, onLoaded: () => void) {
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

  private loadTestAudioPlayer(url: string, audio: HTMLAudioElement) {
    this.loadAudioPlayer(url, audio, () => { 
      this.testLoadedCount += 1;
      // console.log('headset-test loaded audio count: ' + this.testLoadedCount); 
    });
  }

  private loadPollAudioPlayer(url: string, audio: HTMLAudioElement) {
    this.loadAudioPlayer(url, audio, () => { 
      this.pollLoadedCount += 1; 
      // console.log('poll loaded audio count: ' + this.pollLoadedCount); 
    });
  }
}
