Object.defineProperty(HTMLElement.prototype, "removeClass", {
    value: function removeClass(name)
    {
        let classes = this.className.split(" ");
        let className = "";
        for (let i = 0; i < classes.length; i++)
        {
            classes[i] = classes[i].trim();
            if (name !== classes[i]) className += classes[i];
            if (i !== classes.length - 1) className += " ";
        }
        this.className = className.trim();
    }
});

Object.defineProperty(HTMLElement.prototype, "addClass", {
    value: function addClass(name)
    {
        if (!this.className || this.className === "") this.className = name;
        else
        {
            this.removeClass(name);
            this.className += " " + name.trim();
        }
        this.className = this.className.trim();
    }
});

Object.defineProperty(HTMLElement.prototype, "containsClass", {
    value: function containsClass(name)
    {
        let classes = this.className.split(" ");
        for (let i = 0; i < classes.length; i++)
        {
            if (name === classes[i]) return true;
        }
        return false;
    }
});

Object.defineProperty(HTMLElement.prototype, "SetVisiblity", {
    value: function SetVisiblity(visiblity, defaultValue = "block")
    {
        this.style.display = visiblity ? defaultValue : "none";
    }
});

Object.defineProperty(HTMLElement.prototype, "LWidth", {
    get: function ()
    {
        return this.offsetWidth;
    },
});

Object.defineProperty(HTMLElement.prototype, "LHeight", {
    get: function ()
    {
        return this.offsetHeight;
    },
});

Object.defineProperty(HTMLElement.prototype, "LSize", {
    get: function ()
    {
        return { "Width": this.offsetWidth, "Height": this.offsetHeight };
    },
});


Object.defineProperty(HTMLElement.prototype, "_initializeSizeWatcher", {
    value: function ()
    {
        this._resizer =
        {
            "lastWidth": 0,
            "lastHeight": 0,
        }
        this._resizer.interval = setInterval(() =>
        {
            if (this.offsetWidth !== this._resizer.lastWidth || this.offsetHeight !== this._resizer.lastHeight)
            {
                this._resizer.lastWidth = this.offsetWidth;
                this._resizer.lastHeight = this.offsetHeight;
                if (this._onSizeChanged) this._onSizeChanged(this._resizer.lastWidth, this._resizer.lastHeight);
            }
        }, 100);
    }
});

Object.defineProperty(HTMLElement.prototype, "_clearSizeWatcher", {
    value: function ()
    {
        clearInterval(this._resizer.interval);
    }
});

Array.prototype.remove = function ()
{
    var what, a = arguments, L = a.length, ax;
    while (L && this.length)
    {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1)
        {
            this.splice(ax, 1);
        }
    }
    return this;
};