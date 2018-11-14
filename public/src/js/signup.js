
$(document).ready(function () {

//회원가입 함수 등록
$("#signup_submit").click(function(){
    var inputEmail = $('#input_email').val();
    var inputPassword = $('#input_password').val();
    var inputNickname = $('#input_nickname').val();
    if(!isValidate(inputEmail,inputPassword,inputNickname))
        return;

    createUser(inputEmail,inputPassword,inputNickname);
});



function isValidate(inputEmail, inputPassword,inputNickname){
    if(inputEmail==''){
        alert("이메일을 입력해주세요.");
        return false;
    } else if(inputEmail==''){
        alert("비밀번호를 입력해주세요.");
        return false;
    } else if(inputNickname==''){
        alert("닉네임을 입력해주세요.");
        return false;
    }
    return true;
}

function createUser(email, password,nickname) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        //메일가입에 성공했을때
        alert("회원가입 성공");
        //닉네임업데이트
        var user = firebase.auth().currentUser;
        user.updateProfile({
            'displayName':nickname
        }).then(function(){
            //회원정보 갱신 = 페이지 새로고침
            alert("성공적으로 가입되었습니다.");
            location.reload();
        },function(error){
            console.log(error);
            alert(error.message);
        });
        //자동으로 로그인 성공 간주 = onAuthStateChanged()가 작동
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
};


});