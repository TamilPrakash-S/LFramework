class LHTML extends HTMLElement 
{
  constructor()
  {
    super();
  }

  get path() 
  {
    return this.getAttribute('path');
  }

  set path(newValue) 
  {
    this.setAttribute('path', newValue);
  }

  static get observedAttributes() 
  {
    return ['path'];
  }

  attributeChangedCallback(name, oldValue, newValue) 
  {
    if (name == "path")
    {
      let fileName = newValue + "\\" + newValue;
      if(this.getAttribute("prefix")) fileName = this.getAttribute("prefix")+"\\"+fileName;
      fileName = "pages\\" + fileName;
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = (e) =>
      {
        if (xhttp.readyState == 4)
        {
          if (xhttp.status == 200) { this.innerHTML = xhttp.responseText; }
          if (xhttp.status == 404) { this.innerHTML = "Page not found."; }
          // this.removeAttribute("path");
          // includeHTML();
        }
      }
      xhttp.open("GET", fileName + ".html", true);
      xhttp.send();
      FileIncluder.LoadCss(fileName + ".css");
      let loaded = false;
      FileIncluder.LoadJs(fileName + ".js", () => { loaded = true });
      function waitForIt()
      {
        if (!loaded) { setTimeout(() => { waitForIt() }, 100); }
      }
      waitForIt();
    }
  }

}

customElements.define("l-html", LHTML);

class FileIncluder
{
  static LoadHTML()
  {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++)
    {
      elmnt = z[i];
      file = elmnt.getAttribute("lhtml");
      if (file)
      {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function ()
        {
          if (this.readyState == 4)
          {
            if (this.status == 200) { elmnt.innerHTML = this.responseText; }
            if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
            elmnt.removeAttribute("lhtml");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      }
    }
  }

  static async LoadJs(fileName, callback)
  {
    return new Promise(function (myResolve, myReject)
    {

      var script = document.createElement("script");
      script.type = "application/javascript";
      script.onload =
        () =>
        {
          myResolve();
          if(callback) callback();
        };
      script.src = fileName;
      document.head.appendChild(script);
    });
  }

  static LoadCss(fileName, parent)
  {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = fileName;
    link.media = 'all';
    if(parent) parent.head.appendChild(link);
    else document.head.appendChild(link);
  }

}


window.FileIncluder = FileIncluder;