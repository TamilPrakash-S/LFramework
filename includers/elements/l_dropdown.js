class LDropDown extends LDiv
{
    constructor()
    {
        super();
    }

    _initialize()
    {
        this._attachContainer();
        super._initialize();
    }

    _attachSearchBox()
    {
        this._searchContainer = new LDiv();
        this._searchBox = new LTextBox();
        this._searchBox.addEventListener("keyup", (e)=>{this._onSearchChanged(e);});
        this._searchBox.addEventListener("keydown", deletePressed);
        this._searchBox.addEventListener("click", openOptions);

        this._dropdownIcon = document.createElement("a");
        this._dropdownIcon.setAttribute("href", "#");
        this._dropdownIcon.classList.add("dropdown-icon");
        this._dropdownIcon.addEventListener("click", (e)=>{this._onDropDownIconClicked(e)}));

        this._autoCompletedList = document.createElement("ul");


        this._searchContainer.appendChild(this._searchBox);
        this._searchContainer.appendChild(this._autoCompletedList);
        this._searchContainer.appendChild(this._dropdownIcon);
        this._container.appendChild(this._searchContainer);
    }

    _onDropDownIconClicked(e)
    {

    }

    _onSearchChanged()
    {

    }

    _attachContainer()
    {
        this._container = new LDiv();
        this._container.addEventListener("click", () => { this._onContainerClicked(); });
        
        this.replaceChild(this._container);
    }

    _onContainerClicked()
    {

    }

    static get observedAttributes()
    {
        return [].concat(LDiv.observedAttributes);
    }
}

customElements.define("l-dropdown", LDiv);
