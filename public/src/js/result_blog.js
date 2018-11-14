$(document).ready(function(){
    var url_String = window.location.href;
    var url = new URL(url_String);
    var keyword = url.searchParams.get("keyword");
    var ref = firebase.database().ref('keyword/'+keyword);
    

    if(keyword==''||keyword==null){
        alert("잘못된 접근입니다");
        window.location.replace("./index.html");
        return;
    }
    //keyword-title에 키워드 입력
    //document.getElementById("keyword-title").value = keyword;

    //로그인 안 되있으면 반갑습니다만 표시
    //로그인 되있으면 반갑습니다 ㅇㅇㅇ님 표시
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //signed in
            var user = firebase.auth().currentUser;
            var name = user.displayName;
            document.getElementById("user_id").innerHTML = "반갑습니다. <br>"+name+"님";
        } else {
            //no signed in
            document.getElementById("user_id").innerHTML = "반갑습니다.";
        }
    })

    var keywordRef = firebase.database().ref('keyword').orderByChild('date');
    //작성된 주제들 가져와서 뿌려주기
    keywordRef.limitToLast(4).once('value',function(snapshot){
        var hotTopicTiles = $('.popular-keyword');
        var numChildren = snapshot.numChildren();
        var index = 0;
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
            if(childKey==keyword){
                return;
            }
            hotTopicTiles[index].innerText = childKey;
            hotTopicTiles[index].addEventListener('click',function(){
                document.location.href = './result-blog.html?keyword=' + childKey;
            });
            hotTopicTiles[index].style.cursor='pointer';
            index++;
        });
        while(index<8){
            hotTopicTiles[index].innerText = " ";
            index++;
        }
    });
    //작성된 글들 가져와서 뿌려주기
    ref.limitToLast(3).once('value',function(snapshot){
        var numChildren = snapshot.numChildren();
        var index = numChildren;
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            var nthchild = $(".rightside div:nth-child("+index+")");
            nthchild.children()[0].innerHTML = childData.title;
            nthchild.children()[1].innerHTML = getWorldTime(+9,childData.date);
            nthchild.children()[2].innerHTML = childData.content;
            index--;

        });
        if(index==numChildren){//아무것도 글이 없을때
            var firstChild = $(".rightside div:nth-child(1)");
            firstChild.children()[0].innerHTML = "등록된 대나무가 없습니다.";
            firstChild.children()[2].innerHTML = "첫번째 대나무의 주인공이 되어보세요.";
            index++;
        }
    });

    /* 한국 시간 구하는 함수*/
    function getWorldTime(tzOffset, rawdate) { // 24시간제
        var date = new Date(rawdate);
        var tz = date.getTime() + (date.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
        date.setTime(tz);
      
      
        var s =
          leadingZeros(date.getFullYear(), 4) + '-' +
          leadingZeros(date.getMonth() + 1, 2) + '-' +
          leadingZeros(date.getDate(), 2) + ' ' +
      
          leadingZeros(date.getHours(), 2) + ':' +
          leadingZeros(date.getMinutes(), 2) + ':' +
          leadingZeros(date.getSeconds(), 2);
      
        return s;
      }
      function leadingZeros(n, digits) {
        var zero = '';
        n = n.toString();
      
        if (n.length < digits) {
          for (i = 0; i < digits - n.length; i++)
            zero += '0';
        }
        return zero + n;
      }
      /*한국 시간 구하는 함수 */

    //새글 등록 클릭
    $("#new-post").click(function(){
        layer_popup("#dimmed-layer");
    })
    //새글 등록하는 팝업
    function layer_popup(el){

        var $el = $(el);        //레이어의 id를 $el 변수에 저장
        var isDim = $el.prev().hasClass('dimBg');   //dimmed 레이어를 감지하기 위한 boolean 변수

        isDim ? $('.dim-layer').fadeIn() : $el.fadeIn();
        
        var $elWidth = ~~($el.outerWidth()),
            $elHeight = ~~($el.outerHeight()),
            docWidth = $(document).width(),
            docHeight = $(document).height();

        // 화면의 중앙에 레이어를 띄운다.
        if ($elHeight < docHeight || $elWidth < docWidth) {
            $el.css({
                marginTop: -$elHeight /2,
                marginLeft: -$elWidth/2
            })
        } else {
            $el.css({top: 0, left: 0});
        }

        $el.find('a.btn-layerClose').click(function(){
            isDim ? $('.dim-layer').fadeOut() : $el.fadeOut(); // 닫기 버튼을 클릭하면 레이어가 닫힌다.
            //닫기 버튼 누르면 작성하던거 초기화
            document.getElementById("new-post-title").innerHTML = "";
            document.getElementById("new-post-content").innerHTML = "";
            return false;
        });

        $('.layer .dimBg').click(function(){
            $('.dim-layer').fadeOut();
            return false;
        });


    }

    $("#new-post-button").click(function(){
        //새 글 디비에 저장 및 새로고침
        
        var content = document.getElementById("new-post-content").value;
        var title = document.getElementById("new-post-title").value;
        insertNewContent(keyword,content,title);
        $('.dim-layer').fadeOut();
        //글 다시 뿌리기위해 새로고침
        location.reload();
    });

    function insertNewContent(keyword, content,title){
        //insert
        var newKey = ref.push().key;
        var updateValue = {};
        updateValue[newKey+"/title"] = title;
        updateValue[newKey+"/content"] = content;//작성내용
        updateValue[newKey+"/date"] = new Date()//현재날짜 
        return ref.update(updateValue);
    }
    
    
    function getIndexOfContent(keyword){
        var ref = firebase.database().ref('keyword/');
        ref.child(keyword).on("value", function(snapshot) {
            var index = snapshot.numChildren();
            alert("There are "+snapshot.numChildren()+" messages");
        })
    }
})