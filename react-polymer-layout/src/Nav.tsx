import * as React from "react"
import Box from "./Box"
import Item from "./Item"

export interface Props extends React.DOMAttributes<any> {
    logo?: any
    headMenu?: any[]
    sideMenu?: any[]
    headStyle?: React.CSSProperties
    sideStyle?: React.CSSProperties
    style?: React.CSSProperties
    className?: string
}

export interface State {
    portrait?: boolean
    menu?: boolean
    className?: string
}

export default class Nav extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { portrait: false, menu: false, className: Math.random() + "" }
        this.onResize = this.onResize.bind(this)
        this.onHashChange = this.onHashChange.bind(this)
    }

    componentDidMount() {
        window.addEventListener("hashchange", this.onHashChange)
        window.addEventListener("resize", this.onResize)
        this.onResize()
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.onHashChange)
        window.removeEventListener("resize", this.onResize)
    }

    onResize() {
        this.setState({ portrait: window.innerHeight > window.innerWidth })
    }

    onHashChange() {
        this.setState({ menu: false }, () => {
            let elements = document.getElementsByClassName(`${this.state.className}`)
            elements[0].scrollTop = 0
        })
    }

    render() {
        let innerWidth = typeof window === "undefined" ? 0 : window.innerWidth

        let { menu } = this.state
        let {
            logo, headMenu, sideMenu, headStyle, sideStyle,
            style, children, ...otherProps
        } = this.props

        let transitionSide = "margin-left 500ms"
        let transitionMask = menu ?
            "background-color 500ms, z-index 0ms" :
            "background-color 500ms, z-index 0ms 500ms"

        let portrait = (
            <Box vertical fit {...otherProps} style={{ overflow: "hidden", ...style }}>
                <Box center style={headStyle}>
                    <div onClick={() => this.setState({ menu: true })}
                        style={{
                            fontSize: "2em",
                            padding: ".5em .64em",
                            lineHeight: 1,
                            cursor: "pointer"
                        }}>
                        &equiv;
                    </div>
                    <Item flex />
                    {logo}
                </Box>
                <Box flex>
                    <Item className={this.state.className}
                        flex relative style={{ overflow: "auto" }}>
                        <Item style={{ position: "absolute", width: "100%" }}>
                            {children}
                        </Item>
                    </Item>
                </Box>

                <Box fit
                    style={{
                        backgroundColor: `rgba(0,0,0,${menu ? 0.64 : 0})`,
                        zIndex: menu ? 9 : -999,
                        WebkitTransition: transitionMask,
                        MsTransition: transitionMask,
                        transition: transitionMask,
                    }}>
                    <Item relative
                        style={{
                            height: "100%", overflow: "auto",
                            marginLeft: menu ? 0 : -innerWidth,
                            WebkitTransition: transitionSide,
                            MsTransition: transitionSide,
                            transition: transitionSide,
                            ...sideStyle
                        }}>
                        {headMenu}
                        {sideMenu}
                    </Item>
                    <Item flex onClick={() => this.setState({ menu: false })} />
                </Box>
            </Box>
        )

        let landscape = (
            <Box vertical fit {...otherProps} style={{ overflow: "hidden", ...style }}>
                <Box center style={{ zIndex: 5, ...headStyle }}>
                    {logo}
                    <Item flex />
                    {headMenu}
                </Box>
                <Box flex>
                    <Item relative
                        style={{ height: "100%", overflow: "auto", ...sideStyle }}>
                        {sideMenu}
                    </Item>
                    <Item className={this.state.className}
                        flex relative style={{ overflow: "auto" }}>
                        <Item style={{ position: "absolute", width: "100%" }}>
                            {children}
                        </Item>
                    </Item>
                </Box>
            </Box>
        )

        return this.state.portrait ? portrait : landscape
    }
}