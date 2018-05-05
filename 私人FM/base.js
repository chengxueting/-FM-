var $audio=$('audio')[0]
 var ly=[]
$('.btn1').on('click',function(){
    if($audio.paused){
        play()
    }else{
        pause()
    }
})
function play(){
    $audio.play();
        $('.btn1').removeClass('icon-bofang')
                  .addClass('icon-zanting')

}
function pause(){
    $audio.pause();
        $('.btn1').removeClass('icon-zanting')
                  .addClass('icon-bofang')
}
$('.btn2').on('click',function(){
    getChannels()
})
$('.btn3').on('click',function(){
    getMusic()
})
function getChannels(){
    $.ajax({
        url:'http://api.jirengu.com/fm/getChannels.php',
        Method:'get',
        dataType:'json',
        success:function(response){
            var ret=response.channels;
            var num=Math.floor(Math.random()*ret.length)
            var channels_name=ret[num].name;
            var channels_id=ret[num].channel_id;
            $('.music-font p:nth-child(3)').text(channels_name)
            $('.music-font p:nth-child(3)').attr('data-id',channels_id)
            getMusic()
        },
    })
    

    
}
function getMusic(){
    $.ajax({
        url:'http://api.jirengu.com/fm/getSong.php',
        Method:'get',
        dataType:'json',
        data:{
            channel:$('.music-font p:nth-child(3)').attr('data-id')
        },
        success:function(res){
          var music=res.song[0]
          var url=music.url;
          var sid=music.sid;
          var title=music.title;
          var picture=music.picture;
          var artist=music.artist;
          var lrc=music.lrc;
          $('audio').attr("src",url)
          $('audio').attr('sid',sid)
          $('.music-font p:nth-child(2)').text(artist)
          $('.music-font p:nth-child(2)').attr("title",artist)
          $('.music-font p:nth-child(1)').attr("title",title)
          $('.music-font p:nth-child(1)').text(title)
          $('.background').css({
            'background':'url('+picture+')',
            'background-size':'cover',
            'background-repeat':'no-repeat',
            'background-position':'center',
          })
          play()
          getWord()
        },
    })
}
function getWord(){
    var id=$('audio').attr('sid')
    $.ajax({
        url: 'http://api.jirengu.com/fm/getLyric.php',
        Method:'get',
        dataType:'json',
        data:{
            sid: id,
        },
        success: function(ret){
            if(ret.lyric){
                $('.lyric_view ul').empty()
                var aLyric=ret.lyric.split('\n');
                var timeReg=/\[\d{2}:\d{2}.\d{2}\]/g;
                var result=[]
                if(aLyric!=""){
                    for(var i in aLyric){
                    var aTime=aLyric[i].match(timeReg)//得到时间数组
                    var value=aLyric[i].replace(timeReg,"")//得到纯歌词数组
                    for(var j in aTime){
                        var t=aTime[j].slice(1,-1).split(':')
                        var allTime=parseInt(t[0],10)*60+parseFloat(t[1])
                        result.push([allTime,value])
                    }
                }
             }
             result.sort(function(a,b){
                return a[0]-b[0]
            })
            ly=result;
            renderLyric()   
            }
            
        },

    })
}
function  renderLyric(){
    for(var i=0;i<ly.length;i++){
    var liLyric="";
    liLyric+='<li data-time="'+ly[i][0]+'">'+ly[i][1]+'</li>'
    $('.mask ul').append(liLyric)
    }
    setInterval(showLyric,100)
}
function showLyric(){
    for(var i=0;i<ly.length;i++){
        var curT=$('.mask ul li').eq(i).attr('data-time')
        var nexT=$('.mask ul li').eq(i+1).attr('data-time')
        var curTime=$audio.currentTime
        if(curTime>curT&&curT<nexT){
            $('.lyric_view ul li').removeClass('active');
            $('.lyric_view ul li').eq(i).addClass('active')
            $('.lyric_view ul').css('top',-25*(i-2))
        }
}
    }
setInterval(load_music,500)
$('.music-bar1').on('mousedown',function(e){
    var curB=e.clientX;
    var nexB=$(this).offset().left;
    $audio.currentTime=$audio.duration*((curB-nexB)/370)
})
function load_music(){
    var load_time=$audio.currentTime/$audio.duration*100
    $('.music-sidebar').width(load_time+'%')
    if($audio.currentTime==$audio.duration){
        getMusic()
    }
}
$('.icon-shoucang').on('click',function(){
    $(this).toggleClass('star')
})
$('.icon-like').on('click',function(){
    $(this).toggleClass('love')
})
$('.icon-xunhuan').on('click',function(){
    $(this).toggleClass('xunhuan')
    if($(this).hasClass('xunhuan')){
        $('audio').attr('loop','loop')
    }else{
        $('audio').removeAttr('loop','no-loop')
    }
})
$('.icon-bg').on('click',function(){
    $(this).toggleClass('qiehuan')
    if($(this).hasClass('qiehuan')){
        $('.mask').css({
            'background':'none',
            'font-size':0
        })
    }else{
         $('.mask').css({
            background: '#646464',
            opacity: 0.6,
            'font-size':13
           
        })
    }
})
$(document).ready(getChannels())
