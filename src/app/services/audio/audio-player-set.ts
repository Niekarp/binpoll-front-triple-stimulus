export class AudioPlayerSet {

	public headphonesTestPlayers: Map<String, HTMLAudioElement>;
	public pollPlayers: HTMLAudioElement[];
  
	constructor(pollPlayersCount: number){
	  this.headphonesTestPlayers = new Map<String, HTMLAudioElement>();
	  this.pollPlayers = new Array<HTMLAudioElement>(pollPlayersCount);
  
	  this.headphonesTestPlayers = new Map<String, HTMLAudioElement>();
	  this.headphonesTestPlayers.set('left', new Audio());
	  this.headphonesTestPlayers.set('right', new Audio());
  
	  for (let i = 0; i < pollPlayersCount; ++i) {
		this.pollPlayers[i] = new Audio();
	  }
	}
  }
