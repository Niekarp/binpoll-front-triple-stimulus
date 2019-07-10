import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ApiClientService } from '../api-client/api-client.service';
import { Subscription, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';


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

  constructor(private http: HttpClient, private api: ApiClientService) {
    console.log('audio service created');
    this.audioContext = new AudioContext();
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

    this.generateRaisedCosineEnvelope(2 * fadeTimeSeconds, audioSampleRate);
    console.log('raisedCosineEnvelopeFadeInOut');
    console.log(this.raisedCosineEnvelopeFadeInOut);

    // download blobs
    this.api.getSampleSet().subscribe(audioSet => {
      console.log(audioSet);
      //let samples: string[] = audioSet['samples'];
      let samples = [
        'http://antoniuk.pl:8000/static/poll_sounds/BackFromTheStart_brir1_scene1_FB.wav',
        'http://antoniuk.pl:8000/static/poll_sounds/BackFromTheStart_brir1_scene2_BF.wav',
        'http://antoniuk.pl:8000/static/poll_sounds/BackFromTheStart_brir1_scene3_FF.wav'
      ];
      for(let i = 0; i < samples.length; ++i) {
        this.loadAudioBlob(samples[i]).subscribe(arrayBuffer => {
          this.audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
            this.audioBuffers.push(audioBuffer);
          }, (err) => {
            console.error("error");
          });
        });
      }
    });
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

  public play(index: number) {
    this.audioContext.resume().then(() => {
      this.playAudioBuffer(this.audioBuffers[index]);
      this.currentlyPlayingAudioId = index + 1;
    });
  }

  public pause() {
    let startTime = this.audioContext.currentTime;
    for(let audioSource of this.currentlyPlayingSources) {
      audioSource.stop(startTime + fadeTimeSeconds);
    }
    this.currentlyPlayingAudioId = null;
  }

  public isPlaying(index: number) {
    if (this.currentlyPlayingAudioId === index) return true;
    return false;
  }
}
