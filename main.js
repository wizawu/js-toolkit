var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from "react";
import ReactDOM from "react-dom";

const useWebkit = "WebkitAppearance" in document.documentElement.style && !window.chrome;

function assign(target, source) {
    for (let k in source) target[k] = source[k];
}

function getDOMNode(ref) {
    if (React.version > "0.13.x") {
        return ReactDOM.findDOMNode(ref);
    } else {
        return ref.getDOMNode();
    }
}

export const Item = React.createClass({
    displayName: "Item",

    // See Polymer layout attributes
    propTypes: {
        flex: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.string]),
        layout: React.PropTypes.bool,
        wrap: React.PropTypes.bool,
        reverse: React.PropTypes.bool,
        horizontal: React.PropTypes.bool,
        vertical: React.PropTypes.bool,
        center: React.PropTypes.bool,
        start: React.PropTypes.bool,
        end: React.PropTypes.bool,
        stretch: React.PropTypes.bool,
        startJustified: React.PropTypes.bool,
        centerJustified: React.PropTypes.bool,
        endJustified: React.PropTypes.bool,
        justified: React.PropTypes.bool,
        aroundJustified: React.PropTypes.bool,
        selfStart: React.PropTypes.bool,
        selfCenter: React.PropTypes.bool,
        selfEnd: React.PropTypes.bool,
        selfStretch: React.PropTypes.bool,
        relative: React.PropTypes.bool,
        fit: React.PropTypes.bool,
        hidden: React.PropTypes.bool
    },

    render() {
        let props = this.props;
        let style = props.layout ? { display: useWebkit ? "-webkit-box" : "flex" } : {};
        // flex
        if (typeof props.flex === "string") {
            style.flex = style.WebkitBoxFlex = props.flex;
        } else if (props.flex) {
            style.flex = style.WebkitBoxFlex = 1;
        }
        // flex-wrap
        if (props.wrap) {
            style.flexWrap = style.WebkitFlexWrap = "wrap";
        }
        // flex-direction
        if (props.vertical) {
            style.flexDirection = style.WebkitFlexDirection = props.reverse ? "column-reverse" : "column";
            style.WebkitBoxOrient = "vertical";
        } else {
            style.flexDirection = style.WebkitFlexDirection = props.reverse ? "row-reverse" : "row";
            style.WebkitBoxOrient = "horizontal";
        }
        // align-items
        if (props.center) {
            style.alignItems = style.WebkitBoxAlign = "center";
        } else if (props.start) {
            style.alignItems = "flex-start";
            style.WebkitBoxAlign = "start";
        } else if (props.end) {
            style.alignItems = "flex-end";
            style.WebkitBoxAlign = "end";
        } else if (props.stretch) {
            style.alignItems = style.WebkitBoxAlign = "stretch";
        }
        // justify-content
        if (props.startJustified) {
            style.justifyContent = "flex-start";
            style.WebkitBoxPack = "start";
        } else if (props.centerJustified) {
            style.justifyContent = style.WebkitBoxPack = "center";
        } else if (props.endJustified) {
            style.justifyContent = "flex-end";
            style.WebkitBoxPack = "end";
        } else if (props.justified) {
            style.justifyContent = "space-between";
        } else if (props.aroundJustified) {
            style.justifyContent = "space-around";
        }
        // align-self
        if (props.selfStart) {
            style.alignSelf = style.WebkitAlignSelf = "flex-start";
        } else if (props.selfCenter) {
            style.alignSelf = style.WebkitAlignSelf = "center";
        } else if (props.selfEnd) {
            style.alignSelf = style.WebkitAlignSelf = "flex-end";
        } else if (props.selfStretch) {
            style.alignSelf = style.WebkitAlignSelf = "stretch";
        }
        // other
        if (props.relative) {
            style.position = "relative";
        } else if (props.fit) {
            style.position = "absolute";
            style.top = style.bottom = style.left = style.right = 0;
        }
        if (props.hidden) {
            style.display = "none";
        }

        assign(style, props.style);
        return React.createElement(
            "div",
            _extends({}, props, { style: style }),
            props.children
        );
    }
});

export const Layout = React.createClass({
    displayName: "Layout",

    render() {
        return React.createElement(
            Item,
            _extends({ layout: true }, this.props),
            this.props.children
        );
    }
});

export const Box = Layout;

export const Dialog = React.createClass({
    displayName: "Dialog",

    propTypes: {
        style: React.PropTypes.object,
        maskStyle: React.PropTypes.object,
        className: React.PropTypes.string
    },

    getInitialState() {
        return {
            display: "none",
            opacity: 0,
            marginTop: -50,
            timer: null
        };
    },

    componentDidMount() {
        getDOMNode(this.refs.mask).addEventListener("click", this._autoHide);
    },

    componentWillUnmount() {
        getDOMNode(this.refs.mask).removeEventListener("click", this._autoHide);
    },

    _autoHide(e) {
        if (e.target === getDOMNode(this.refs.mask)) this.hide();
    },

    show() {
        if (this.state.timer) return;
        let that = this;
        this.state.timer = setInterval(() => {
            if (that.state.opacity < 0.99) {
                that.state.opacity += 0.10;
                that.state.marginTop += 5;
                that.setState({
                    display: useWebkit ? "-webkit-box" : "flex"
                });
            } else {
                clearInterval(that.state.timer);
                that.state.timer = null;
            }
        }, 20);
    },

    hide() {
        if (this.state.timer) return;
        let that = this;
        this.state.timer = setInterval(() => {
            if (that.state.opacity < 0.01) {
                that.setState({ display: "none" });
                clearInterval(that.state.timer);
                that.state.timer = null;
            } else {
                that.state.opacity -= 0.10;
                that.state.marginTop -= 5;
                that.setState({});
            }
        }, 20);
    },

    render() {
        let maskStyle = {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 9
        };

        maskStyle.display = this.state.display;
        maskStyle.opacity = Math.sin(Math.PI * this.state.opacity / 2);
        assign(maskStyle, this.props.maskStyle);

        let dialogStyle = {
            width: "50%",
            background: "white",
            padding: "1em",
            boxShadow: "0 4px 8px #333"
        };

        dialogStyle.marginTop = Math.sin(Math.PI * this.state.marginTop / 100) * 50;
        assign(dialogStyle, this.props.style);

        return React.createElement(
            Layout,
            { ref: "mask", center: true, centerJustified: true, style: maskStyle },
            React.createElement(
                Item,
                { ref: "dialog", style: dialogStyle, className: this.props.className },
                this.props.children
            )
        );
    }
});

export default {
    Item: Item,
    Layout: Layout,
    Box: Layout,
    Dialog: Dialog
};
