class LKeyValueLabel extends LDiv
{
    constructor()
    {
        super();
    }

    get Key()
    {
        return this.getAttribute('key');
    }

    set Key(value)
    {
        this.setAttribute('key', value);
    }

    get Value()
    {
        return this.getAttribute('value');
    }
    
    set Value(value)
    {
        this.setAttribute('value', value);
    }

    _initialize()
    {
        super._initialize();
        this._attachContainer();
        this._attachKeyLabel();
        this._attachValueLabel();
    }   

    _attachContainer()
    {
        this._container = document.createElement('div');
        this._container.className = "kContainer";
        this._container.style.width = "100%";
        this._container.style.columnCount = 2;
        this._container.style.columnGap = 0;
        this.style.color = "var(--primary_color)";

        this.appendChild(this._container);
    }

    _attachKeyLabel()
    {
        this._keyLabel = new LLabel();
        this._keyLabel.TextAlign = "middleLeft";
        this._keyLabel.innerHTML = this.Key;
        this._keyLabel.style.fontWeight = "1000";
        this._keyLabel.style.color = "inherit";
        this._keyLabel.style.paddingLeft = "5%";
        this._keyLabel.style.fontSize = ".9em";
        this._keyLabel.style.fontSize = "85%";
        this._keyLabel.style.height = "100%";
        
        this._container.appendChild(this._keyLabel);
    }
    
    _attachValueLabel()
    {
        this._valueLabel = new LLabel();
        this._valueLabel.TextAlign = "middleLeft";
        this._valueLabel.innerHTML = this.Value;
        this._valueLabel.style.fontWeight = "bold";
        this._valueLabel.style.fontWeight = "300";
        this._valueLabel.style.color = "inherit";
        this._valueLabel.style.fontSize = ".9em";
        this._valueLabel.style.fontSize = "85%";
        this._valueLabel.style.height = "100%";
        this._container.appendChild(this._valueLabel);
    }

    _updatextSize()
    {
        
    }

    _onSizeChanged(width, height)
    {
        
        super._onSizeChanged(width, height);
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        switch(name)
        {
            case 'key':
                this._keyLabel.innerHTML = newValue;
                break;
            case 'value':
                this._valueLabel.innerHTML = newValue;
                break;
        }
    }

    static get observedAttributes()
    {
        return ['key', 'value'];
    }
}

customElements.define("l-key-value", LKeyValueLabel);