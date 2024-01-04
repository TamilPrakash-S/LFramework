class LTextBox extends LDiv
{
    constructor()
    {
        super();
    }

    get Placeholder()
    {
        return this.getAttribute("placeholder");
    }

    set Placeholder(value)
    {
        this.setAttribute("placeholder", value);
    }

    get Text()
    {
        return this._input.value;
    } 

    set Text(value)
    {
        this._input.value = value;
    } 

    _initialize()
    {
        this.TextChanged = undefined;
        this.attrbs['placeholder'] = this._onPlaceholderChanged.bind(this);
        this._attachContents();
        super._initialize();
    }

    _onPlaceholderChanged(value)
    {
        this._input.setAttribute("placeholder", value)
    }   

    _onTextChanged()
    {
        if(this.TextChanged) setTimeout(()=>{this.TextChanged()}, 10);
    }

    _attachContents()
    {
        this.style.borderRadius = "5px";
        this._child = new LDiv();
        this._child.style.width = "100%";
        this._child.style.height = "90%";
        this._child.style.borderRadius = "inherit";
        this._child.style.border = "1px solid var(--gray)";
        this.appendChild(this._child);     
        
        this._attachTextBox();
    }

    _attachTextBox()
    {
        this._input = document.createElement('input');
        this._input.onkeydown = ()=>{this._onTextChanged()};
        this._input.oncut = ()=>{this._onTextChanged()};
        this._input.onpaste = ()=>{this._onTextChanged()};
        this._input.className = "lInput";
        this._input.style.width = "97%";
        this._input.style.height = "100%";
        this._input.style.fontSize = "110%";
        this._input.style.paddingLeft = "3%";
        this._input.style.borderRadius = "inherit"; 
        this._input.style.border = "hidden";
        this._input.style.color ="var(--primary_color)";
        this._input.onfocus = ()=>
        {
            this._input.style.outline = "none";
            this._child.style.border = "1px solid var(--primary_color)";
        };

        this._input.onblur = ()=>
        {
            this._child.style.border = "1px solid var(--gray)";
        };
        this._child.appendChild(this._input);
    }

    _onSizeChanged(width, height)
    {
        this._child.style.marginTop = (height * .05) - 2;
        // this._child.style.marginLeft = width * .05;
        super._onSizeChanged(width, height);
    }

    static get observedAttributes()
    {
        return ['placeholder'].concat(LDiv.observedAttributes);
    }
}

window.document.styleSheets[0].insertRule(".lInput::placeholder {color:rgba(var(--rgbVal), .8);}", window.document.styleSheets[0].cssRules.length);
customElements.define("l-textbox", LTextBox);