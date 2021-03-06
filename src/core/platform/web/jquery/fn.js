if (jQuery) {
    (function ($) {
        // richer:容器在其各个边缘留出的空间
        if (!$.fn.insets) {
            $.fn.insets = function () {
                var p = this.padding(),
                    b = this.border();
                return {
                    top: p.top,
                    bottom: p.bottom + b.bottom + b.top,
                    left: p.left,
                    right: p.right + b.right + b.left
                };
            };
        }

        // richer:获取 && 设置jQuery元素的边界
        if (!$.fn.bounds) {
            $.fn.bounds = function (value) {
                var tmp = {hasIgnoredBounds: true};

                if (value) {
                    if (!isNaN(value.x)) {
                        tmp.left = value.x;
                    }
                    if (!isNaN(value.y)) {
                        tmp.top = value.y;
                    }
                    if (value.width != null) {
                        tmp.width = (value.width - (this.outerWidth(true) - this.width()));
                        tmp.width = (tmp.width >= 0) ? tmp.width : value.width;
                        // fix chrome
                        // tmp.width = (tmp.width >= 0) ? tmp.width : 0;
                    }
                    if (value.height != null) {
                        tmp.height = value.height - (this.outerHeight(true) - this.height());
                        tmp.height = (tmp.height >= 0) ? tmp.height : value.height;
                        // fix chrome
                        // tmp.height = (tmp.height >= 0) ? tmp.height : value.0;
                    }
                    this.css(tmp);
                    return this;
                }

                // richer:注意此方法只对可见元素有效
                tmp = this.position();
                return {
                    x: tmp.left,
                    y: tmp.top,
                    // richer:这里计算外部宽度和高度的时候，都不包括边框
                    width: this.outerWidth(),
                    height: this.outerHeight()
                };

            };
        }
    })(jQuery);

    BI.extend(jQuery.fn, {

        destroy: function () {
            this.remove();
            if (BI.isIE() === true) {
                this[0].outerHTML = "";
            }
        },
        /**
         * 高亮显示
         * @param text 必需
         * @param keyword
         * @param py 必需
         * @returns {*}
         * @private
         */
        __textKeywordMarked__: function (text, keyword, py) {
            if (!BI.isKey(keyword) || (text + "").length > 100) {
                return this.html(BI.htmlEncode(text));
            }
            keyword = keyword + "";
            keyword = BI.toUpperCase(keyword);
            var textLeft = (text || "") + "";
            py = (py || BI.makeFirstPY(text)) + "";
            if (py != null) {
                py = BI.toUpperCase(py);
            }
            this.empty();
            while (true) {
                var tidx = BI.toUpperCase(textLeft).indexOf(keyword);
                var pidx = null;
                if (py != null) {
                    pidx = py.indexOf(keyword);
                    if (pidx >= 0) {
                        pidx = pidx % text.length;
                    }
                }

                if (tidx >= 0) {
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft.substr(0, tidx)));
                    this.append($("<span>").addClass("bi-keyword-red-mark")
                        .html(BI.htmlEncode(textLeft.substr(tidx, keyword.length))));

                    textLeft = textLeft.substr(tidx + keyword.length);
                    if (py != null) {
                        py = py.substr(tidx + keyword.length);
                    }
                } else if (pidx != null && pidx >= 0 && Math.floor(pidx / text.length) === Math.floor((pidx + keyword.length - 1) / text.length)) {
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft.substr(0, pidx)));
                    this.append($("<span>").addClass("bi-keyword-red-mark")
                        .html(BI.htmlEncode(textLeft.substr(pidx, keyword.length))));
                    if (py != null) {
                        py = py.substr(pidx + keyword.length);
                    }
                    textLeft = textLeft.substr(pidx + keyword.length);
                } else {
                    // 标红的text未encode
                    this.append(BI.htmlEncode(textLeft));
                    break;
                }
            }

            return this;
        },

        getDomHeight: function (parent) {
            var clone = $(this).clone();
            clone.appendTo($(parent || "body"));
            var height = clone.height();
            clone.remove();
            return height;
        },

        // 是否有竖直滚动条
        hasVerticalScroll: function () {
            return this.height() > 0 && this[0].clientWidth < this[0].offsetWidth;
        },

        // 是否有水平滚动条
        hasHorizonScroll: function () {
            return this.width() > 0 && this[0].clientHeight < this[0].offsetHeight;
        },

        // 获取计算后的样式
        getStyle: function (name) {
            var node = this[0];
            var computedStyle = void 0;

            // W3C Standard
            if (_global.getComputedStyle) {
                // In certain cases such as within an iframe in FF3, this returns null.
                computedStyle = _global.getComputedStyle(node, null);
                if (computedStyle) {
                    return computedStyle.getPropertyValue(BI.hyphenate(name));
                }
            }
            // Safari
            if (document.defaultView && document.defaultView.getComputedStyle) {
                computedStyle = document.defaultView.getComputedStyle(node, null);
                // A Safari bug causes this to return null for `display: none` elements.
                if (computedStyle) {
                    return computedStyle.getPropertyValue(BI.hyphenate(name));
                }
                if (name === "display") {
                    return "none";
                }
            }
            // Internet Explorer
            if (node.currentStyle) {
                if (name === "float") {
                    return node.currentStyle.cssFloat || node.currentStyle.styleFloat;
                }
                return node.currentStyle[BI.camelize(name)];
            }
            return node.style && node.style[BI.camelize(name)];
        },

        __isMouseInBounds__: function (e) {
            var offset2Body = this.get(0).getBoundingClientRect ? this.get(0).getBoundingClientRect() : this.offset();
            var width = offset2Body.width || this.outerWidth();
            var height = offset2Body.height || this.outerHeight();
            // offset2Body.left的值可能会有小数，导致某点出现false
            return !(e.pageX < Math.floor(offset2Body.left) || e.pageX > offset2Body.left + width
                || e.pageY < Math.floor(offset2Body.top) || e.pageY > offset2Body.top + height);
        },

        __hasZIndexMask__: function (zindex) {
            return zindex && this.zIndexMask[zindex] != null;
        },

        __buildZIndexMask__: function (zindex, domArray) {
            this.zIndexMask = this.zIndexMask || {};// 存储z-index的mask
            this.indexMask = this.indexMask || [];// 存储mask
            var mask = BI.createWidget({
                type: "bi.center_adapt",
                cls: "bi-z-index-mask",
                items: domArray
            });

            mask.element.css({"z-index": zindex});
            BI.createWidget({
                type: "bi.absolute",
                element: this,
                items: [{
                    el: mask,
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }]
            });
            this.indexMask.push(mask);
            zindex && (this.zIndexMask[zindex] = mask);
            return mask.element;
        },

        __releaseZIndexMask__: function (zindex) {
            if (zindex && this.zIndexMask[zindex]) {
                BI.remove(this.indexMask, this.zIndexMask[zindex]);
                this.zIndexMask[zindex].destroy();
                return;
            }
            this.indexMask = this.indexMask || [];
            var indexMask = this.indexMask.pop();
            indexMask && indexMask.destroy();
        }
    });
}
