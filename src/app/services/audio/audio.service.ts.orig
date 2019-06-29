import { Injectable } from '@angular/core';
import { AudioPlayerSet } from './audio-player-set';

@Injectable({
  providedIn: 'root',
})
export class AudioService {

  private audioPlayers: AudioPlayerSet;

  constructor() {
    console.log('audio service created');
    this.audioPlayers = new AudioPlayerSet(30);
  }

  public loadAudioPlayers() {
    let baseUrl = './../../assets/headphones test sounds/';
    let filename = '';

    let audio = this.audioPlayers.headphonesTestPlayers.get('left');
    
    let req = new XMLHttpRequest();
    req.open('GET', 'https://cdn.glitch.com/21f22462-51ad-49b0-b379-48155d20b764%2Fsample.mp3', true);
    req.responseType = 'blob';

    req.onload = function() {
      // Onload is triggered even on 404
      // so we need to check the status code
      if (this.status === 200) {
         let audioBlob = this.response;
         let audioUrl = URL.createObjectURL(audioBlob); // IE10+
         // Video is now downloaded
         // and we can set it as source on the video element
         console.log('audio loaded: ' + audioUrl);
         audio.src = audioUrl;
         audio.load();
      }
   }
   req.onerror = function() {
      // Error
   }
   
   req.send();
   

    // load headset channel test audio
<<<<<<< HEAD
    this.audioPlayers.headphonesTestPlayers.get('left').src = baseUrl + 'Hungarian_1_hrtf4_sector2.wav';
    this.audioPlayers.headphonesTestPlayers.get('left').load();
=======
    // this.audioPlayers.headphonesTestPlayers.get('left').src = baseUrl + 'Hungarian_1_hrtf4_sector2.wav';
    // this.audioPlayers.headphonesTestPlayers.get('left').load();
>>>>>>> refs/remotes/origin/master

    this.audioPlayers.headphonesTestPlayers.get('right').src = baseUrl + 'Hungarian_1_hrtf4_sector4.wav';
    this.audioPlayers.headphonesTestPlayers.get('right').load();

    // get samples
    let sampleUrls = this.soundsFilenames;

    // load poll samples audio
    for(let i = 0; i < this.audioPlayers.pollPlayers.length; ++i) {
      this.audioPlayers.pollPlayers[i].src = sampleUrls[i];
      this.audioPlayers.pollPlayers[i].load();
    }
  }

  // headphones test audio methods
  public pauseHeadphonesTestAudio() {
    this.audioPlayers.headphonesTestPlayers.get('left').pause();
    this.audioPlayers.headphonesTestPlayers.get('right').pause();
  }

  public toggleHeadphonesTestLeftChannelAudio() {
    if (this.audioPlayers.headphonesTestPlayers.get('left').paused)
      this.audioPlayers.headphonesTestPlayers.get('left').play();
    else
      this.audioPlayers.headphonesTestPlayers.get('left').pause();
  }

  public toggleHeadphonesTestRightChannelAudio() {
    if (this.audioPlayers.headphonesTestPlayers.get('right').paused)
      this.audioPlayers.headphonesTestPlayers.get('right').play();
    else
      this.audioPlayers.headphonesTestPlayers.get('right').pause();
  }

  public get headphonesTestLeftChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('left');
  }

  public get headphonesTestRightChannelAudio(): HTMLAudioElement {
    return this.audioPlayers.headphonesTestPlayers.get('right');
  }

  public testAudio() { 
    console.log(this.audioPlayers.pollPlayers);
    this.audioPlayers.pollPlayers[29].play();
  }

  private soundsFilenames: string[] = [ 
    "./../../../assets/poll sounds/Place2Be_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/Place2Be_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/Place2Be_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/Place2Be_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/RumbaChonta_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/Scar_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/SchoolboyFascination_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene2_BF.wav",
    "./../../../assets/poll sounds/GhostlyBeard_brir1_scene3_FF.wav",
    "./../../../assets/poll sounds/Place2Be_brir1_scene1_FB.wav",
    "./../../../assets/poll sounds/Place2Be_brir1_scene2_BF.wav"];
  /* [ " ./../../assets/poll sounds/AloneWithYou_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/AloneWithYou_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/AloneWithYou_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/AloneWithYou_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/AloneWithYou_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/AloneWithYou_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/APlaceForUs_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/BackFromTheStart_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Directions_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/DonCamilloChoir_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Downtempo_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/FlecheDOr_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/FlyHigh_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/GhostlyBeard_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/GoodTime_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/HappyBlues_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/IAmAlright_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Mozart_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/MyOwn_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/NewDayDawning_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/OdeToBregovic_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/PassingShips_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Place2Be_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/PrayForTheRain_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Progresivo_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Rachel_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/RumbaChonta_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Scar_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SchoolboyFascination_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Shore_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SixtyFourBristol_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/SlowDown_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TalkToMeBaby_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TearsInTheRain_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/ThatsEntertainment_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TheBluesIsALady_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TheLongWait_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/ThroughMyEyes_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TooBright_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/TrudeTheBumblebee_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Verdi_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/Widow_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/WolfsHead_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/WordGetsAround_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene1_FB.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene2_BF.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene3_FF.wav",
  " ./../../assets/poll sounds/AllTheGinIsGone_brir1_scene3_FF.wav"]; */
}
