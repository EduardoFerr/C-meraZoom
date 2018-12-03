
(function(){

/* predefinir zoom e girar*/
  var zoom = 1,
      rotate = 0;

/*Pegue os elementos DOM necessários*/
  var stage = document.getElementById('stage'),
      v = document.getElementsByTagName('video')[0],
      controls = document.getElementById('controls');
  
/* Matriz de configurações específicas do navegador possíveis para transformação */
  var properties = ['transform', 'WebkitTransform', 'MozTransform',
                    'msTransform', 'OTransform'],
      prop = properties[0];

/* Iteradores e coisas */    
  var i,j,t;
  
/* Descubra qual CSS transform  o navegador suporta */
  for(i=0,j=properties.length;i<j;i++){
    if(typeof stage.style[properties[i]] !== 'undefined'){
      prop = properties[i];
      break;
    }
  }

/* Posição do video */
  v.style.left = 0;
  v.style.top = 0;

  /*Se houver um elemento de controle, adicione os botões do player*/
  /* TODO: por que o Opera não exibe os botões de rotação?*/
  if(controls){
    controls.innerHTML =  '<button class="play">iniciar</button>'+
                          '<div id="change">' +
                            '<button class="zoomin">+</button>' +
                            '<button class="zoomout">-</button>' +
                           
                            '<button class="reset">reset</button>' +
                          '</div>';
  }

/* Se um botão foi clicado (usa delegação de evento) ...*/
  controls.addEventListener('click',function(e){
    t = e.target;
    if(t.nodeName.toLowerCase()==='button'){

/*Verifique o nome da turma do botão e aja de acordo */    
      switch(t.className){

/*Alternar a funcionalidade de reprodução e o rótulo do botão */    
        case 'play':
          if(v.paused){
            v.play();
            t.innerHTML = 'pausar';
          } else {
            v.pause();
            t.innerHTML = 'iniciar';
          }
        break;

/* Aumentar zoom e definir a transformação */
        case 'zoomin':
          zoom = zoom + 0.1;
          v.style[prop]='scale('+zoom+') rotate('+rotate+'deg)';
        break;

/* Diminua o zoom e defina a transformação */
        case 'zoomout':
          zoom = zoom - 0.1;
          v.style[prop]='scale('+zoom+') rotate('+rotate+'deg)';
        break;

/*Redefinir tudo para o padrão*/
        case 'reset':
          zoom = 1;
          rotate = 0;
          v.style.top = 0 + 'px';
          v.style.left = 0 + 'px';
          v.style[prop]='rotate('+rotate+'deg) scale('+zoom+')';
        break;
      }        

      e.preventDefault();
    }
  },false);

  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'environment',
    }
  })
  .then((stream) => {
    const video = document.querySelector('video');
    video.srcObject = stream;
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();
    const settings = track.getSettings();
    console.log(track);
    console.log(capabilities);
    console.log(settings);
    const currentZoomLevel = capabilities.zoom;
    console.log(currentZoomLevel);

    })
  .catch(err => console.error('getUserMedia() failed: ', err));
})();