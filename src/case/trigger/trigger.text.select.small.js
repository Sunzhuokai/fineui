/**
 * 选择字段trigger小一号的
 *
 * @class BI.SmallSelectTextTrigger
 * @extends BI.Trigger
 */
BI.SmallSelectTextTrigger = BI.inherit(BI.Trigger, {

    _defaultConfig: function () {
        return BI.extend(BI.SmallSelectTextTrigger.superclass._defaultConfig.apply(this, arguments), {
            baseCls: "bi-small-select-text-trigger bi-border",
            height: 20
        });
    },

    _init: function () {
        this.options.height -= 2;
        BI.SmallSelectTextTrigger.superclass._init.apply(this, arguments);
        var self = this, o = this.options;
        var obj = this._digest(o.text, o.items);
        this.trigger = BI.createWidget({
            type: "bi.small_text_trigger",
            element: this,
            height: o.height - 2,
            text: obj.text,
            cls: obj.cls
        });
    },

    _digest: function(vals, items){
        var o = this.options;
        vals = BI.isArray(vals) ? vals : [vals];
        var result = [];
        var formatItems = BI.Tree.transformToArrayFormat(items);
        BI.each(formatItems, function (i, item) {
            if (BI.deepContains(vals, item.value) && !result.contains(item.text || item.value)) {
                result.push(item.text || item.value);
            }
        });

        if (result.length > 0) {
            return {
                cls: "",
                text: result.join(",")
            }
        } else {
            return {
                cls: "bi-water-mark",
                text: o.text
            }
        }
    },

    setValue: function (vals) {
        this.trigger.setText(this._digest(vals, this.options.items));
    },

    populate: function (items) {
        this.options.items = items;
    }
});
BI.shortcut("bi.small_select_text_trigger", BI.SmallSelectTextTrigger);