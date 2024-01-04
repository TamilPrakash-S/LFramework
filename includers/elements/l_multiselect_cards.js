class LMultiselectCards extends LGrid
{
    constructor() 
    {
        super();
    }

    get CardWidth()
    {
        return this.getAttribute('card-width');
    }

    set CardWidth(val)
    {
        return this.setAttribute('card-width', val);
    }

    get CardHeight()
    {
        return this.getAttribute('card-height');
    }

    set CardHeight(val)
    {
        return this.setAttribute('card-height', val);
    }

    get SelectedIndex()
    {
        let res = [];
        for (let i = 0; i < this.Cards.length; i++)
        {
            if (this.Cards[i].checkBox.Checked) res.push(i);
        }
        return res;
    }

    get Count()
    {
        return this.Cards.length;
    }

    Clear()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.style.display = "none";
        }
    }

    HideCard(index)
    {
        this.Cards[index].card.style.display = "none";
    }

    ShowCard(index)
    {
        this.Cards[index].card.style.display = "block";
    }

    SetSelected(index, val)
    {
        this.Cards[index].checkBox.Checked = val;
    }

    SelectAll()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].checkBox.Checked = true;
        }
    }

    DeselectAll()
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].checkBox.Checked = false;
        }
    }

    CheckAndAddCard(index, name, body)
    {
        if (!this.Cards[index])
        {
            let card = new LCard();
            card._container.style.boxShadow = "";
            card._container.style.boxShadow = "0 1px 14px 0 rgb(0 0 0 / 10%)";
            // 2px 2px 5px #BABECC!important
            // card._container.style.boxShadow = "0 2px 2px rgba(0, 0, 0, 0.01), 0 4px 4px rgba(0, 0, 0, 0.02), 0 8px 8px rgba(0, 0, 0, 0.03)," +
            //     " 0 18px 18px rgba(0, 0, 0, 0.04),0 28px 28px rgba(0, 0, 0, 0.05), 0 38px 38px rgba(0, 0, 0, 0.06); ";
            // card._container.style.backgroundColor = "var(--cbgColor)";
            // card._container.style.border = "5px solid var(--secondary_color)";
            // card._container.style.boxShadow = "-2px -2px 5px rgba(255, 255, 255, 1)," +
            //     "1px 1px 3px rgba(0, 0, 0, .3)," +
            //     "-1px -1px 3px rgba(0, 0, 0, .3)," +
            //     "2px 2px 5px rgba(0, 0, 0, 0.1) inset," +
            //     "-2px -2px 5px rgba(0, 0, 0, 0.1) inset";
            // card._container.style.borderRadius = "10px";
            card.HeaderVisible = true;
            card.style.margin = "5px";
            card.FooterVisible = false;
            card.style.width = this.CardWidth;
            card.style.height = this.CardHeight;
            this.Cards[index] = this._attachCardHeader(card, index);
            this.Cards[index]["card"] = card;
            this.appendChild(card);
        }
        else this.Cards[index].checkBox.Checked = false;

        this.Cards[index].card.style.display = "block";
        this.Cards[index]['card'].Body.innerHTML = "";
        this.Cards[index]['card'].Body.appendChild(body);
        this.Cards[index]['header'].innerHTML = name;
    }

    _attachCardHeader(card, index)
    {
        let label = new LLabel();
        label.style.fontSize = "1.2em";
        label.style.fontWeight = "1000";
        label.style.width = "85%";
        label.style.height = "100%";
        label.style.lineHeight = "100%";
        label.style.paddingLeft = "3%";
        label.innerHTML = "Label";
        label.TextAlign = "bottomLeft";
        label.TextAlign = "middleLeft";

        let checkBox = new LCheckBox();
        checkBox.CheckChanged = (ele, val) => { this._onSelectedChanged(index, val); };
        checkBox.style.width = "15%";
        checkBox.style.height = "100%";

        card.Header.appendChild(label);
        card.Header.appendChild(checkBox);
        card.onclick = () => { checkBox.Checked = !checkBox.Checked; };
        return { 'header': label, 'checkBox': checkBox };
    }

    _onSelectedChanged(ind, val)
    {
        if (this.SelectedChanged)
        {
            this.SelectedChanged(ind, val);
        }
    }

    _initialize()
    {
        this.SelectedChanged = undefined;
        this.Cards = [];
        this.attrbs['multi-selectable'] = (value) => { this._isMultiselectable(value) };
        this.attrbs['card-width'] = (value) => { this._onCardWidthChanged(value) };
        this.attrbs['card-height'] = (value) => { this._onCardHeightChanged(value) };
        super._initialize();
    }

    _onCardWidthChanged(value)
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.Width = value;
        }
    }

    _onCardHeightChanged(value)
    {
        for (let i = 0; i < this.Cards.length; i++)
        {
            this.Cards[i].card.Height = value;
        }
    }

    _isMultiselectable(value)
    {

    }

    static get observedAttributes()
    {
        return ['multi-selectable', 'card-width', 'card-height'].concat(LGrid.observedAttributes);
    }
}

customElements.define("l-multiselect-cards", LMultiselectCards);