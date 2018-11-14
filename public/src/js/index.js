$(document).ready(function () {

    var ref = firebase.database().ref('keyword');
    //작성된 주제들 가져와서 뿌려주기
    ref.limitToLast(8).once('value',function(snapshot){
        var hotTopicTiles = $('.hotTopicTile');
        var numChildren = snapshot.numChildren();
        var index = 0;
        snapshot.forEach(function(childSnapshot){
            var childKey = childSnapshot.key;
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

    var $login = $('.login');
    //로그인 여부에따라 LOGIN or LOGOUT표시
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //signed in
            $login.text("LOGOUT");
            //$login.style.color = "black";

        } else {
            //no signed in
            $login.text("LOGIN");
        }
    })

    // document.getElementsById("login").onclick = function(){alert("aa")};
   document.querySelector('.login').addEventListener('click', function(e){
        var state = $login.text();
        if (state == 'LOGOUT') {
            //logout
            firebase.auth().signOut().then(function () {
                alert("로그아웃 되었습니다");
                location.reload();
            }, function (error) {
                alert(error.message);
            });
        } else if (state == "LOGIN") {
            //login
            alert("로그인페이지로이동합니다");
            window.location.href = "./login.html";
        } else {
            ;
        }
   });
});