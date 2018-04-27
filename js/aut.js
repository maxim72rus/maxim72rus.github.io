
$(document).ready(function(){
    $('.content').on('click','#button-Aut', function(e){
        var login = $('#login').val().toString();
        var password = $('#password').val().toString();
        
        var aut = {
            "aut":{
                "login": login,
                "password": password
            }
        };

        $.ajax({
            url: url+"/getRegDocs",
            success: function(data){
                window.parent.location.href="./docs.html";
                window.sessionStorage.setItem("login",login);
                window.sessionStorage.setItem("password",password);
            },
            type: "POST",
            error:function(jqXHR){
                alert(jqXHR.statusText);
                //alert('Не верный логин или пароль');
            },
            data: JSON.stringify(aut)
        });
    });
});
