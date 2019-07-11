export class AudioPlayerSet {

	public headphonesTestPlayers: Map<String, HTMLAudioElement>;
	public pollBuffers: Array<AudioBuffer[]>;
  
	constructor(pollTasksCount: number){
	  this.headphonesTestPlayers = new Map<String, HTMLAudioElement>();
	  this.pollBuffers = new Array<AudioBuffer[]>(pollTasksCount);
  
	  this.headphonesTestPlayers = new Map<String, HTMLAudioElement>();
	  this.headphonesTestPlayers.set('left', new Audio());
	  this.headphonesTestPlayers.set('right', new Audio());
  
	  for (let i = 0; i < pollTasksCount; ++i) {
		this.pollBuffers[i] = new Array<AudioBuffer>(3);
	  }
	}
  }
