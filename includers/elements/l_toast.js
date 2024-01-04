class LToast extends LDiv
{
    constructor()
    {
        super();
    }

    _initialize()
    {
        this._attachBody();
        super._initialize();
    }

    _attachBody()
    {
        let borderRadius = "5px";
        this.style.zIndex = "10000000";
        this.style.position = "absolute";
        this.style.height = LToast.DefaultHeight;
        this.style.width = "300px";
        this.style.bottom = "100px";
        this.style.left = "calc(50vw - 150px)";
        this.style.animationDuration = "5s";
        this.style.animationFillMode = "both";
        this._body = new LCard();
        this._body.style.height = "100%";
        this._body.style.width = "100%";
        this.appendChild(this._body);

        this._cardBody = new LDiv();
        this._cardBody.style.height = "100%";
        this._cardBody.style.width = "100%";
        this._cardBody.style.display = "flex";
        this._cardBody.style.borderRadius = borderRadius;
        this._body.appendChild(this._cardBody);

        this._leftHighlighter = new LDiv();
        this._leftHighlighter.style.borderTopLeftRadius = borderRadius;
        this._leftHighlighter.style.borderBottomLeftRadius = borderRadius;
        this._leftHighlighter.style.width = "5px";
        this._leftHighlighter.style.height = "100%";
        this._leftHighlighter.style.backgroundColor = "var(--primary_color)";
        this._cardBody.appendChild(this._leftHighlighter);

        this._label = new LLabel();
        this._label.style.margin = "5px";
        this._label.Text = "Message";
        this._label.style.fontWeight = "bold";
        this._cardBody.appendChild(this._label);
    }

    static Show(type, message, duration, width, height)
    {
        if (!message) return;
        if (!LToast.Instance.parentElement) document.body.appendChild(LToast.Instance);
        if (!duration) duration = LToast.DefaultDuration;
        if (!width) width = LToast.DefaultWidth;
        if (!height) height = LToast.DefaultHeight;
        LToast.Instance.style.height = height;
        LToast.Instance.style.width = width;
        switch (type)
        {
            case 1:
                LToast.Instance._leftHighlighter.style.backgroundColor = "var(--primary_color)";
                LToast.Instance._label.style.color = "var(--primary_color)";
                break;
            case 2:
                LToast.Instance._leftHighlighter.style.backgroundColor = "rgb(var(--warnRgb))";
                LToast.Instance._label.style.color = "rgb(var(--warnRgb))";
                break;
            case 3:
                LToast.Instance._leftHighlighter.style.backgroundColor = "rgb(var(--errorRgb))";
                LToast.Instance._label.style.color = "rgb(var(--errorRgb))";
                break;
        }
        LToast.Instance._label.Text = message;
        if (LToast._cTimerOut) clearTimeout(LToast._cTimerOut);
        LAnimation.UnFade(LToast.Instance);
        LToast._cTimerOut = setTimeout(() =>
        {
            LAnimation.Fade(LToast.Instance);
        }, duration);
    }

    static Init()
    {
        if (LToast._isInitialized) return;
        LToast._isInitialized = true;
        LToast.Instance = new LToast();
        LToast.Instance.style.opacity = "0";
        LToast.DefaultWidth = "300px";
        LToast.DefaultHeight = "80px";
        LToast.DefaultDuration = "1000";
    }
}

customElements.define("l-toast", LToast);
if (!window.LHolder) window.LHolder = window.LHolder = { "LToast": LToast };
else window.LHolder.LToast = LToast;
LToast.Init();