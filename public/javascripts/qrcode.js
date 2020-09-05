
let qrcode = ()=>{
    var x = document.getElementsByClassName("qrcode");
    var i;
    for (i = 0; i < x.length; i++) {
        console.log(x[i].id)
        new QRCode(x[i],{
            text:x[i].id,
            width:150,
            height:150
        });
    }
    // let elemento = document.getElementsByClassName("qrcode")
    // console.log(elemento)
    
}
qrcode();