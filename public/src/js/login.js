$(document).ready(function () {

    var uiConfig = {
        'signInSuccessUrl':'/index.html',//인증 성공시 이동할URL
        'signInOptions':[//인증방법
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        'tosUrl':'/auth_term.html'//이용약관 URL
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container',uiConfig);


    //그냥 로그인 클릭
    $("login_submit").click(function(){
        var inputEmail = document.getElementById("input_email").value;
        var inputPassword = document.getElementById("input_password").value;

        firebase.auth().signInWithEmailAndPassword(inputEmail,inputPassword).then(function(){
            //메일회원 로그인 성공
        }).catch(function(error){
            alert(error.message);
        });
    });

    //구글로그인 클릭
    $("#google_login_button").click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            //로그인성공시
            $('#auth_state').text(result.user.displayName + "님이 로그인 하셨습니다.");
        }).catch(function (error) {
            alert(error.message);
        });
    });
    
    $("#google_login_button").click(function () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            //로그인성공시
            $('#auth_state').text(result.user.displayName + "님이 로그인 하셨습니다.");
        }).catch(function (error) {
            alert(error.message);
        });
    });

    //인증 상태 변화 감시하기
    firebase.auth().onAuthStateChanged(function(user){
        if(user){//인증되었을떄
            $('#auth_state').text(result.user.displayName + "님이 로그인 하셨습니다.");
            $('logout').show();//로그아웃 버튼 활성화
            //user.displayName
            //user.email
            //user.uid
        }else{
            $('#auth_state').text("(인증되지 않음)");
            $('logout').hide();
        }
    });
});