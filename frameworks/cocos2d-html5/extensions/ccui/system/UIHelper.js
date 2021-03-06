/****************************************************************************
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * UI Helper
 * @namespace
 * @name ccui.helper
 */
ccui.helper = {
	/**
	 * Finds a widget whose tag equals to param tag from root widget.
	 * @param {ccui.Widget} root
	 * @param {number} tag
	 * @returns {ccui.Widget}
	 */
	seekWidgetByTag: function (root, tag) {
	    if (!root)
	        return null;
	    if (root.getTag() == tag)
	        return root;

	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekWidgetByTag(child, tag);
	        if (res != null)
	            return res;
	    }
	    return null;
	},

	/**
	 * Finds a widget whose name equals to param name from root widget.
	 * @param {ccui.Widget} root
	 * @param {String} name
	 * @returns {ccui.Widget}
	 */
	seekWidgetByName: function (root, name) {
	    if (!root)
	        return null;
	    if (root.getName() == name)
	        return root;
	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekWidgetByName(child, name);
	        if (res != null)
	            return res;
	    }
	    return null;
	},

	/**
	 * Finds a widget whose name equals to param name from root widget.
	 * RelativeLayout will call this method to find the widget witch is needed.
	 * @param {ccui.Widget} root
	 * @param {String} name
	 * @returns {ccui.Widget}
	 */
	seekWidgetByRelativeName: function (root, name) {
	    if (!root)
	        return null;
	    var arrayRootChildren = root.getChildren();
	    var length = arrayRootChildren.length;
	    for (var i = 0; i < length; i++) {
	        var child = arrayRootChildren[i];
	        var layoutParameter = child.getLayoutParameter(ccui.LayoutParameter.RELATIVE);
	        if (layoutParameter && layoutParameter.getRelativeName() == name)
	            return child;
	    }
	    return null;
	},

	/*temp action*/
	seekActionWidgetByActionTag: function (root, tag) {
	    if (!root)
	        return null;
	    if (root.getActionTag() == tag)
	        return root;
	    var arrayRootChildren = root.getChildren();
	    for (var i = 0; i < arrayRootChildren.length; i++) {
	        var child = arrayRootChildren[i];
	        var res = ccui.helper.seekActionWidgetByActionTag(child, tag);
	        if (res != null)
	            return res;
	    }
	    return null;
	}
};
