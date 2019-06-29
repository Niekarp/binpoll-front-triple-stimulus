import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ApiClientService } from '../api-client/api-client.service';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AudioService {

  private audioPlayers: AudioPlayerSet;
  private loaded = false;
  private audioSet = { id: -1, samples: Array<string>() };
  private pollLoadedCount = 0;
  private testLoadedCount = 0;

  private audioRequests = new Array<Subscription>();

  constructor(private http: HttpClient, private api: ApiClientService) {
    console.log('audio service created');
    this.audioPlayers = new AudioPlayerSet(30);
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

    // get samples
    this.api.getSampleSet().subscribe(audioSet => {
      this.audioSet.id = audioSet['id'];
      this.audioSet.samples = audioSet['samples'];
      
      // load poll samples audio
      for(let i = 0; i < this.audioPlayers.pollPlayers.length; ++i) {
        this.loadPollAudioPlayer(this.audioSet.samples[i], this.audioPlayers.pollPlayers[i]);
        this.audioPlayers.pollPlayers[i].loop = true;
      }
    });
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
    if (this.audioPlayers.pollPlayers[audioIndex].paused) {
      this.playPollAudio(audioIndex);
      return true;
    } else {
      this.audioPlayers.pollPlayers[audioIndex].pause();
      return false;
    }
  }

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
  }

  private toggleAudio(audio: HTMLAudioElement): boolean {
    if (audio.paused) audio.play();
    else audio.pause();
    return !audio.paused;
  }

  private loadAudioPlayer(url: string, audio: HTMLAudioElement, onLoaded: () => void) {
    const request = this.http.get(url, {responseType: 'blob'}).subscribe(response => {
      let audioBlob = response;
      let audioUrl = URL.createObjectURL(audioBlob);
      console.log('audio loaded: ' + audioUrl);
      audio.src = audioUrl;
      audio.load();
      
      onLoaded();
    });

    this.audioRequests.push(request);
  }

  private loadTestAudioPlayer(url: string, audio: HTMLAudioElement) {
    this.loadAudioPlayer(url, audio, () => { 
      this.testLoadedCount += 1;
      console.log('headset-test loaded audio count: ' + this.testLoadedCount); 
    });
  }

  private loadPollAudioPlayer(url: string, audio: HTMLAudioElement) {
    this.loadAudioPlayer(url, audio, () => { 
      this.pollLoadedCount += 1; 
      console.log('poll loaded audio count: ' + this.pollLoadedCount); 
    });
  }
}
