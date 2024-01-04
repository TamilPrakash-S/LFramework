class LAnimation
{
    static AttachRipple(element, customColor)
    {
        element.addEventListener("click", function(e) {
            this.style.position = "relative";
            this.style.overflow = "hidden";
            let rect = element.getBoundingClientRect();
            let X = e.pageX - rect.left;
            let Y = e.pageY - rect.top;
            let rippleDiv = document.createElement("div");
            rippleDiv.classList.add('l_ripple');
            rippleDiv.setAttribute("style","top:"+Y+"px; left:"+X+"px;");
            if(customColor) rippleDiv.style.background = customColor;
            this.appendChild(rippleDiv);
            setTimeout(function(){
              rippleDiv.parentElement.removeChild(rippleDiv);
            }, 900);
        });
    }

    static Fade(element, interval)
    {
        if(element.getAttribute("currentAnimation"))
        {
            clearInterval(element.getAttribute("currentAnimation"));
        }
        if (!interval) interval = 10;
        let op = 1;  // initial opacity
        let timer = setInterval(function ()
        {
            if (op <= 0.1)
            {
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 50);
        element.setAttribute("currentAnimation", timer);
    }

    static UnFade(element, interval)
    {
        if(element.getAttribute("currentAnimation"))
        {
            clearInterval(element.getAttribute("currentAnimation"));
        }
        if (!interval) interval = 10;
        let op = 0.1;  // initial opacity
        element.style.display = 'block';
        let timer = setInterval(function ()
        {
            if (op >= 1)
            {
                clearInterval(timer);
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
        element.setAttribute("currentAnimation", timer);
    }
}

window.document.styleSheets[0].insertRule(".l_ripple{position: absolute;background: #fff;border-radius: 50%;width: 5px;height: 5px;animation: l_rippleEffect .88s 1;opacity: 0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_rippleEffect {0% {transform: scale(1);opacity: 0.4;}100% {transform: scale(100);opacity: 0;}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_rotate {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_fadeIn {0% {0% {opacity: 0;}100% {0% {opacity: 1;}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@keyframes l_fadeOut {0% {0% {opacity: 1;}100% {0% {opacity: 0;}}", window.document.styleSheets[0].cssRules.length);