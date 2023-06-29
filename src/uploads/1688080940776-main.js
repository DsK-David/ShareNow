function getpassword(){
    var chars='0012345678910abcdefgktyisiycnusgueyi@fsi8[]]38749347739sdkhpvrehpriugugeuvfb'
    var chars1='0012345678910ABCDEFGHIGKLMNOPQ[]}#$%&/(@?)()=$%&'
    var chars2 = 'abcdefgktyisiycnusgueyi@fsi8[]]sdkhpvrehpriugugeuvfb'
    var view = '';
    var recentpass=[]
    var passwordlength = document.getElementById('password-length').value;
    for (var i = 0; i < passwordlength; i++){
     var randomNumber = Math.floor(Math.random() * chars.length);
     view += chars.substring(randomNumber , randomNumber + 1)
    }
    document.getElementById('view').innerHTML= view
    document.getElementById('view').style.background="#000"
}