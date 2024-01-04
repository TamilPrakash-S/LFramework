class LSelect extends LDiv
{
    constructor(settings)
    {
        super();
        this.select = null;
        this.display = null;
        this.list = null;
        this.options = [];
        this.isLarge = false;
        this.value = null;
        this.selected = null;
        this.highlighted = null;
        this.selectedIndex = -1;
        this._ulist = undefined;
        this.settings = this.getSettings(settings);
        this.event = document.createEvent("HTMLEvents");
        this.event.initEvent("change", false, true);
        this._init();

    }

    get PlaceHolder()
    {
        return this.getAttribute("placeholder");
    }

    set PlaceHolder(value)
    {
        this.setAttribute("placeholder", value);
    }

    OnSelectionChanged(){}

    GetSelectedData()
    {
        if(!this.selected) return null;
        return {value:this.selected.getAttribute('data-value'), text : this.selected.innerHTML};
    }

    ShowLoader()
    {
        this.display.classList.add('circleLoader');
    }

    HideLoader()
    {
        this.display.classList.remove('circleLoader');
    }

    SetSelected(value)
    {
        let res = this._ulist.querySelectorAll('[data-value="' + value + '"]');
        if (res)
        {
            this._setSelectedItem(res[0]);
        }
    }

    Reset()
    {
        this._setSelectedItem(null);
        this._update();
    }

    Clear()
    {
        this._ulist.innerHTML = "";
        this.Reset();
    }

    AddItem(dataValue, text)
    {
        this._addItem(dataValue, text);
    }

    _init()
    {
        this.attrbs['placeholder'] = this._onPlaceholderChanged.bind(this);
        this.buildSelect();
        this.innerHTML = "";
        this.appendChild(this.select);

        document.addEventListener('click', this._handleClickOff.bind(this));
        this.positionList();
    }

    _onPlaceholderChanged(value, oldVal)
    {
        if (!this.selected) 
        {
            this.display.innerHTML = value;
            this.display.style.fontWeight = "normal";
        }
    }

    _handleClickOff(e)
    {
        if (!this.select.contains(e.target)) this.closeList();
    }

    buildSelect()
    {
        this.select = new LDiv();
        this.select.classList.add('l-select');
        this.select.setAttribute('tabindex', this.tabIndex);
        this.select.addEventListener('keydown', this.handleSelectKeydown.bind(this));

        this.display = document.createElement('span');
        this.display = new LLabel();
        this.display.TextAlign = "middleLeft";
        this.display.classList.add('value');
        this.display.addEventListener('click', this.handleDisplayClick.bind(this));
        this.select.appendChild(this.display);
        this.buildList();
        if (this.options.length && this.selectedIndex != -1)
        {
            this.value = this.options[this.selectedIndex].getAttribute('data-value');
            this.OnSelectionChanged();
            this.selected = this.options[this.selectedIndex];
            this.display.innerHTML = this.selected.innerHTML;
        }

        if ((this.settings.filtered === 'auto' && this.options.length >= this.settings.filter_threshold) ||
            this.settings.filtered === true)
        {
            this.isLarge = true;
            this.select.classList.add('large');
        }
    }

    buildList()
    {
        this.list = new LDiv();
        this.list.classList.add('list');
        this.list.setAttribute('tabindex', '-1');
        this.list.addEventListener('keydown', this.handleListKeydown.bind(this));
        this.list.addEventListener('mouseenter', function ()
        {
            if (this.options[this.highlighted]) this.options[this.highlighted].classList.remove('hovered');
        }.bind(this));

        this.highlighted = this.selectedIndex;
        this.buildFilter();
        this.buildOptions();
        this.select.appendChild(this.list);
    }

    buildFilter()
    {
        var wrapper = new LDiv();
        wrapper.classList.add('filter');
        this.filter = document.createElement('input');
        this.filter.type = 'text';
        this.filter.setAttribute('placeholder', this.settings.filter_placeholder);
        this.filter.addEventListener('keyup', this.handleFilterKeyup.bind(this));
        wrapper.appendChild(this.filter);
        this.list.appendChild(wrapper);
    }

    buildOptions()
    {
        this._ulist = document.createElement('ul');
        var options = this.querySelectorAll('option');
        for (var i = 0; i < options.length; i++)
        {
            this._addItem(options[i].value, options[i].innerHTML);
        }
        this.list.appendChild(this._ulist);
    }

    _addItem(dataValue, text)
    {
        var li = document.createElement('li');
        li.setAttribute('data-value', dataValue);
        li.innerHTML = text;
        li.addEventListener('click', this.handleOptionClick.bind(this));
        this._ulist.appendChild(li);
        this.options.push(li);
    }

    toggleList()
    {
        if (this.list.classList.contains('open'))
        {
            this.list.classList.remove('open');
            this.options[this.highlighted].classList.remove('hovered');
            this.select.focus();
        }
        else
        {
            this.options[this.selectedIndex].classList.add('hovered');
            this.highlighted = this.selectedIndex;
            this.list.classList.add('open');
            this.list.focus();
        }
    }

    positionList()
    {
        if (!this.isLarge && this.selected) this.list.style.top = '-' + this.selected.offsetTop + 'px';
    }

    highlightOption(dir)
    {
        var next = null;
        switch (dir)
        {
            case 'up':
                next = (this.highlighted - 1 < 0) ? this.highlighted : this.highlighted - 1;
                break;
            case 'down':
                next = (this.highlighted + 1 > this.options.length - 1) ? this.highlighted : this.highlighted + 1;
                break;
            default:
                next = this.highlighted;
        }
        this.options[this.highlighted].classList.remove('hovered');
        this.options[next].classList.add('hovered');
        this.highlighted = next;
    }

    clearFilter()
    {
        this.filter.value = '';
        for (var i = 0; i < this.options.length; i++) this.options[i].style.display = 'block';
    }

    clearFilter()
    {
        this.filter.value = '';

        for (var i = 0; i < this.options.length; i++)
        {
            this.options[i].style.display = 'block';
        }
    }

    closeList()
    {
        this.list.classList.remove('open');
        if (this.options.length && this.options[this.highlighted])
            this.options[this.highlighted].classList.remove('hovered');
    }

    getSettings(settings)
    {
        let defaults = {
            filtered: 'auto',
            filter_threshold: 8,
            filter_placeholder: 'Search'
        };
        for (let p in settings)
            defaults[p] = settings[p];
        return defaults;
    }

    handleSelectKeydown(e)
    {
        if (this.select === document.activeElement && e.keyCode == 32) this.toggleList();
    }

    handleDisplayClick()
    {
        this.list.classList.add('open');
        if (this.isLarge) this.filter.focus();
    }

    handleListKeydown(e)
    {
        return; 
        //TODO : Need to Fix
        if (this.list !== document.activeElement) return;
        switch (e.keyCode)
        {
            case 38:
                this.highlightOption('up');
                break;
            case 40:
                this.highlightOption('down');
                break;
            case 13:
                this.value = this.options[this.highlighted].getAttribute('data-value');
                this.selected = this.options[this.highlighted];
                this.display.innerHTML = this.options[this.highlighted].innerHTML;
                this.closeList();
                setTimeout(this.positionList.bind(this), 200);
                this.select.focus();
                break;
        }

    }

    handleFilterKeyup(e)
    {
        var self = this;
        this.options.filter(function (li)
        {
            if (li.innerHTML.toLowerCase().includes(self.filter.value.toLowerCase())) li.style.display = 'block';
            else li.style.display = 'none';
        });
    }

    handleOptionClick(e)
    {
        let value = e.target.getAttribute('data-value');
        if (this.value === value)
        {
            this._setSelectedItem(null);
        }
        else
        {
            this._setSelectedItem(e.target);
        }
        this.dispatchEvent(this.event);
        this.closeList();
        this.clearFilter();
        setTimeout(this.positionList.bind(this), 200);
    }

    _setSelectedItem(liItem)
    {
        if (this.selected) this.selected.classList.remove("selected");
        this.selected = liItem;
        this.OnSelectionChanged();
        this.value = "";
        if (this.selected)
        {
            this.selected.classList.add("selected");
            this.value = this.selected.getAttribute('data-value');
        }
        this._update();
    }

    _update()
    {
        if (this.selected)
        {
            this.display.innerHTML = this.selected.innerHTML;
            this.display.style.fontWeight = "bold";
        }
        else
        {
            this.display.innerHTML = this.PlaceHolder;
            this.display.style.fontWeight = "normal";
        }
    }

    static get observedAttributes()
    {
        return ['placeholder'].concat(LDiv.observedAttributes);
    }
}
window.document.styleSheets[0].insertRule("l-select{position:relative;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select{height:100%;outline: none;position:relative}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .value{padding-left:5px;font-weight:bold;font-size:.9em; height:90%; display:block;color:var(--primary_color);border:1px solid rgba(var(--shadow_color_rgb), .1);cursor:pointer;overflow-x:hidden;white-space:nowrap}", window.document.styleSheets[0].cssRules.length);
//window.document.styleSheets[0].insertRule(".l-select .value::after{top: calc(25% - 2px);right: 4px;position: absolute;content: '';border-bottom-width: initial;border-style: solid;border-color: var(--primary_color) transparent transparent transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .value::after{top: calc(50% - 2px);right: 8px;position: absolute;content: '';border-bottom-width: initial;border-style: solid;border-color: var(--primary_color) transparent transparent transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select:focus .value{border-bottom:2px solid rgba(var(--rgbVal), .8)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list{position:absolute;top:0!important;width:100%;height:0;background:#fff;opacity:0;outline:0;-webkit-box-shadow:0 2px 9px rgba(0,0,0,.35);box-shadow:0 2px 9px rgba(0,0,0,.35);overflow:hidden;-webkit-transition:opacity .1s cubic-bezier(.39,.575,.565,1);transition:opacity .1s cubic-bezier(.39,.575,.565,1);z-index:9999}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list.open{height:auto;opacity:1}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list .filter{display:none;padding:8px 10px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list .filter input{width:100%;font-family:helvetica,arial,sans-serif;font-size:12px;color:#1f202a;border:none;border-bottom:1px solid #eaeaea;outline:0;margin:0;padding:0 0 5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul{margin:0;padding:0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul li{border-radius:4px;list-style:none;font-size:12px;color:#1f202a;padding:8px 10px;cursor:pointer}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select .list ul li.hovered,.l-select .list ul li:hover{color:#fff;background:rgba(var(--rgbVal), .8)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large{width:100%!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large .filter{display:block}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-select.large .list ul{max-height:200px;overflow-y:scroll}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div > ul::-webkit-scrollbar{width:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div{padding:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div, l-select > l-div > l-label, l-select > l-div > l-div{border-radius:inherit;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select{border-radius:5px}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select > l-div > l-div > ul > li.selected{font-weight:bold}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("l-select .circleLoader::after {top: calc(20% - 2px)!important;right: 10px!important;border: 3px solid var(--gray);border-radius: 50%;border-top: 3px solid var(--primary_color);animation: l_rotate 1s linear infinite;width: 20;height: 20;}", window.document.styleSheets[0].cssRules.length);

customElements.define("l-select", LSelect);