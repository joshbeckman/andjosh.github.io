/*! AnchorJS - v0.1.0 - 2014-08-17 | https://github.com/bryanbraun/anchorjs | Copyright (c) 2014 Bryan Braun; Licensed MIT */function addAnchors(e){e=e||"h1, h2, h3, h4, h5, h6";var t=document.querySelectorAll(e);for(var n=0;n<t.length;n++){var r;if(t[n].hasAttribute("id")){r=t[n].getAttribute("id")}else{var i=document.body.textContent?"textContent":"innerText";var s=t[n][i];tidyText=s.replace(/\s+/g,"-").toLowerCase();t[n].setAttribute("id",tidyText);r=tidyText}var o='<a class="anchor" href="#'+r+'"><span class="octicon octicon-link"></span></a>';t[n].innerHTML=t[n].innerHTML+o}}addAnchors('.content h2, .content h3, .content h4, .content h5');
function expandPre(){for(var e,n=document.querySelectorAll(".highlight"),i=window.innerWidth,t=0;t<n.length;t++)e=Math.max(0,i-n[t].clientWidth),n[t].style.margin="0 -"+e/2+"px 16px",n[t].children[0].style.padding="20px "+e/2+"px"}expandPre();

function expandImg() {
    var c = document.querySelector('.content'),
        imgs = c ? c.querySelectorAll('img') : [],
        w = window.innerWidth,
        p = Math.min(1000, w);

    for (var i = 0; i < imgs.length; i++) {
        imgs[i].style.maxWidth = p + 'px';
        imgs[i].style.marginLeft =
            (Math.min(c.clientWidth - (Math.min(imgs[i].clientWidth, p)), 0) / 2) + 'px';
    }
}

expandImg();
