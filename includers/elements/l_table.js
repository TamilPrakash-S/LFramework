class LTable extends LDiv
{
    constructor(fetchDataCallback)
    {
        super();
        this._fetchDataCallback = fetchDataCallback ? fetchDataCallback : () => { };
        this._lastSortEle = undefined;
    }

    get ItemsPerPage()
    {
        return this._pagination.ItemsPerPage;
    }

    set ItemsPerPage(val)
    {
        this._pagination.ItemsPerPage = val;
    }

    get TotalItems()
    {
        return this._pagination.TotalItems;
    }

    set TotalItems(val)
    {
        this._pagination.TotalItems = val;
    }

    get StartIndex()
    {
        return this._pagination.StartIndex;
    }

    get CurrentPage()
    {
        return this._pagination.CurrentPage;
    }

    set CurrentPage(val)
    {
        this._pagination.CurrentPage = val;
    }

    get TotalPages()
    {
        return this._pagination.TotalPages;
    }

    get SearchText()
    {
        return this._searchBox.Text;
    }

    get SortText()
    {
        if (!this._lastSortEle) return "";
        return "`" + this._lastSortEle.innerText + "` " + (this._lastSortEle.containsClass("asc") ? "ASC" : "DESC");
    }

    SetData(columns, data, stInd)
    {
        if (!stInd || stInd === -1) stInd = 0;

        let val = this._body.scrollTop / 20;
        let interval = setInterval(() =>
        {
            if (this._body.scrollTop === 0) clearInterval(interval);
            this._body.scrollTop -= val;
        }, 5);
        if (!this._header.element)
        {
            this._header.element = document.createElement("tr");
            this._table.appendChild(this._header.element);
        }
        for (let i = 0; i < columns.length; i++)
        {
            if (!this._header.data[i])
            {
                this._header.data[i] = document.createElement("th");
                // LAnimation.AttachRipple(this._header.data[i], "var(--secondary_color)");
                this._header.data[i].addEventListener("click", () => { this._onHeaderClicked(this._header.data[i]); });
                this._header.element.appendChild(this._header.data[i]);
            }
            this._header.data[i].innerHTML = columns[i];
        }
        let j = 0;
        let dtIndex = stInd;
        for (; j < this.ItemsPerPage && j < data.length - stInd; j++, dtIndex++)
        {
            if (!this._rows[j])
            {
                this._rows[j] = { element: null, data: [] };
                this._rows[j].element = document.createElement("tr");
                this._table.appendChild(this._rows[j].element);
            }
            this._rows[j].element.style.display = "table-row";
            for (let i = 0; i < columns.length; i++)
            {
                if (!this._rows[j].data[i])
                {
                    this._rows[j].data[i] = document.createElement("td");
                    this._rows[j].element.appendChild(this._rows[j].data[i]);
                }
                this._rows[j].data[i].innerHTML = data[dtIndex][i];
            }
        }
        while (j < this._rows.length)
        {
            this._rows[j++].element.style.display = "none";
        }
    }

    ResetSort()
    {
        if (!this._lastSortEle) return;
        this._lastSortEle.removeClass("asc");
        this._lastSortEle.removeClass("desc");
        this._lastSortEle = undefined;
    }


    Reset()
    {
        this.ResetSort();
        this._searchBox.Text = "";
    }

    PageChanged() 
    {

    }

    SearchTextChanged()
    {

    }

    SortHeadChanged(text, order)
    {

    }

    _onHeaderClicked(element)
    {

        if (element.containsClass("asc"))
        {
            element.removeClass("asc");
            element.addClass("desc");
        }
        else
        {
            element.removeClass("desc");
            element.addClass("asc");
        }
        if (this._lastSortEle && this._lastSortEle !== element)
        {
            this._lastSortEle.removeClass("asc");
            this._lastSortEle.removeClass("desc");
        }
        this._lastSortEle = element;
        this.SortHeadChanged(element.innerHTML, element.containsClass("asc") ? "ASC" : "DESC");
    }

    _initialize()
    {
        this._attachElements();
        this._header = { element: null, data: [] };
        this._rows = [];
        super._initialize();
    }

    _attachElements()
    {
        this._attachHeader();
        this._attachBody();
        this._attachFooter();
    }

    _attachHeader()
    {
        this._header = new LDiv();
        this._header.style.width = "100%";
        this._header.style.display = "flex";
        this._header.style.height = "60px";
        this._header.style.position = "relative";
        this._attachHeaderLeft();

        this._attachHeaderRight();
        this.appendChild(this._header);
    }

    _onSearchTextChanged()
    {
        this.ResetSort();
        this.SearchTextChanged();
    }

    _attachHeaderRight()
    {
        this._headerRight = new LDiv();
        this._headerRight.style.position = "absolute";
        this._headerRight.style.display = "flex";
        this._headerRight.style.right = "5px";
        this._headerRight.style.top = "5px";
        this._headerRight.style.height = "50px";

        this._searchBox = new LIconTextBox();
        this._searchBox.style.width = "220px";
        this._searchBox.style.height = "90%";
        this._searchBox.Icon = "search";
        this._searchBox.TextChanged = () => { this._onSearchTextChanged(); };


        this._headerRight.appendChild(this._searchBox);
        this._header.appendChild(this._headerRight);

    }

    _attachHeaderLeft()
    {
        this._headerLeft = new LDiv();
        this._headerLeft.style.display = "flex";
        this._headerLeft.style.height = "50px";
        this._headerLeft.style.marginTop = "5px";

        this._buttonPrint = LTable._getButton("Print");
        this._buttonPrint.addEventListener('click', () => { this._onPrintBtnClicked(); });
        this._buttonPrint.style.marginLeft = "5px";
        // this._headerLeft.appendChild(this._buttonPrint);


        this._buttonCopy = LTable._getButton("Copy");
        this._buttonCopy.addEventListener('click', () => { this._onCopyBtnClicked(); });
        this._headerLeft.appendChild(this._buttonCopy);

        this._buttonCsv = LTable._getButton("CSV");
        this._buttonCsv.addEventListener('click', () => { this._onCsvBtnClicked(); });
        this._headerLeft.appendChild(this._buttonCsv);

        this._header.appendChild(this._headerLeft);
    }


    _onPrintBtnClicked()
    {

    }

    _onCopyBtnClicked()
    {
        this._fetchDataCallback(this.StartIndex, -1, this._searchBox.Text, (res) =>
        {
            LHelper.CopyClipboard(res.map(e => e.join("\t")).join("\n"));
        });
    }

    _onCsvBtnClicked()
    {
        this._fetchDataCallback(this.StartIndex, -1, this._searchBox.Text, (res) =>
        {
            LHelper.DownloadCSV(res, "Today.csv");
        });
    }

    _attachBody()
    {
        this._body = new LDiv();
        this._body.style.borderRadius = "10px 10px 3px 3px;";
        this._body.style.height = "calc(100% - 130px)";
        this._body.style.overflowY = "auto";
        this._table = document.createElement("table");
        this._table.className = "l-table";
        this._body.appendChild(this._table);
        this.appendChild(this._body);
    }

    _attachFooter()
    {
        this._footer = new LDiv();
        this._footer.style.height = "65px";
        this._footer.style.padding = "2px";
        this._footer.style.paddingTop = "12px";
        this._footer.style.width = '100%';
        this._footer.style.position = 'relative';
        this._pagination = new LPagination();
        this._pagination.style.width = '100%';
        this._pagination.style.height = '80%';
        // this._pagination.style.position = "absolute";
        // this._pagination.style.right = "2";

        this._pagination.PageChanged = (stInd, itemsPerPg) => { this._fetchDataCallback(stInd, itemsPerPg); this.PageChanged(); };
        this._footer.appendChild(this._pagination);
        this.appendChild(this._footer);
    }

    static _getButton(text)
    {
        let button = new LButton();
        button.innerHTML = text;
        button.style.border = "1px solid rgba(var(--rgbVal), .1)";
        button.style.borderRadius = "8px";
        button.style.backgroundColor = "var(--secondary_color)";
        button.style.color = "var(--primary_color)";
        button.style.fontWeight = "bolder";
        button.style.width = "80px";
        button.style.height = "75%";
        button.style.marginTop = "3px";
        button.style.marginLeft = "5px";
        button.style.boxShadow = "0 4px 5px 0 var(--shadow_color),0 1px 2px 0 var(--shadow_color),0 1px 1px -1px var(--shadow_color)";
        LAnimation.AttachRipple(button, "rgba(var(--rgbVal), .2)");
        return button;
    }

    static get observedAttributes()
    {
        return [].concat(LDiv.observedAttributes);
    }
}
window.document.styleSheets[0].insertRule(".l-table{border-radius:5px 5px 3px 3px; margin-left:5px;margin-right:5px;background-color:var(--secondary_color);border-spacing: 1px;margin-top:-2px;width:calc(100% - 10px);border-radius:10px 10px 5px 5px;border:1px solid rgba(var(--grayRgbVal), .5)}", window.document.styleSheets[0].cssRules.length);

window.document.styleSheets[0].insertRule(".l-table tr{border:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr{background-color:var(--secondary_color)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:hover{background-color:rgba(var(--rgbVal), .1)!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:nth-child(odd){background-color:rgba(var(--rgbVal), .03)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{display:none;background-color:var(--secondary_color);color:var(--primary_color);border-bottom: 3px solid rgba(var(--rgbVal), 1);padding:.7em;position:sticky!important;top:0!important}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:first-child{display:table-cell;text-align:center}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:first-child{border-radius:5px 3px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:last-child{border-radius:3px 5px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2){display:table-cell}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2) span{display:none}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td{max-width: none;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2)  {border-radius:3px 10px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:nth-child(2):after{content:attr(data-th);border-radius:3px 10px 0 0}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table th:nth-child(2)  {border-radius:3px 3px 0 0}.l-table th:nth-child(2) span{display:block}.l-table th:nth-child(2):after{display:none}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td{display:block;word-wrap:break-word;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td:first-child{display:table-cell;text-align:center;border-right:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table td{border:1px solid rgba(var(--grayRgbVal), .2)}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table td,.l-table th{text-align:left;margin:.5em 1em}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule("@media (min-width:900px){.l-table td{max-width: none;} .l-table td,.l-table th{display:table-cell;padding:.7em}}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{border-radius:3px 3px 0 0;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table tr:last-child td{border-radius:0 0 3px 3px;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th{user-select:none}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th:after{  top: calc(50% - 2px);right: 8px;position: absolute;content: '';display: none;border-bottom: none;" +
    "border-style: solid;border-top-style: solid;border-right-style: solid;border-bottom-style: solid;" +
    "border-left-style: solid;border-color: var(--primary_color) transparent;}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th.asc:after{border-width: 0px 4px 4px;display:block}", window.document.styleSheets[0].cssRules.length);
window.document.styleSheets[0].insertRule(".l-table th.desc:after{border-width: 4px 4px 0px;display:block}", window.document.styleSheets[0].cssRules.length);
customElements.define("l-table", LTable);