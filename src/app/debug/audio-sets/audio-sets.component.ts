import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-audio-sets',
  templateUrl: './audio-sets.component.html',
  styleUrls: ['./audio-sets.component.scss']
})
export class AudioSetsComponent implements OnInit {

  private REQUEST_URL = `${this.config.urlConfig.apiUrl}/available_audio_set/`;
  private REFRESH_INTERVAL = 5 * 1000;

  constructor(public config: ConfigService) {
  }

  ngOnInit() {
    this.doRefresh();

    // setInterval(() => {
    
    // }, this.REFRESH_INTERVAL);
  }

  refresh() {
    this.doRefresh();
  }

  doRefresh() {
    const $mainContainer = document.getElementById('audio-sets-container');

    $mainContainer.innerHTML = '';

    const response = fetch(this.REQUEST_URL, { mode: 'cors' }).then(response => {
      response.json().then(data => {
        const audioSets = data;
        let j = 0;
        for (let i = 0; i < 156; ++i) {
          const $audioSet = document.createElement('div');
          $audioSet.innerHTML = (i + 1).toString();
          // $audioSet.classList.add('audio-set');
          // color: white;
          // margin: 2px;
          // flex: 0 0 50px;
          // text-align: center;
          // transition: height 2s;
          $audioSet.style.color = 'white';
          $audioSet.style.margin = '2px';
          $audioSet.style.marginBottom = '50px';
          $audioSet.style.flex = '0 0 50px';
          $audioSet.style.textAlign = 'center';
          
          if (audioSets[j].audioSet.id - 1 !== i) {
            $audioSet.style.height = '80px';
            $audioSet.style.backgroundColor = 'green';
          } else if (audioSets[j].isLocked) {
            $audioSet.style.height = '50px';
            $audioSet.style.backgroundColor = 'brown';
            ++j;
          } else {
            $audioSet.style.height = '20px';
            $audioSet.style.backgroundColor = 'blue';
            ++j
          }
          $mainContainer.append($audioSet);
        }
      })
    });
  }

}
