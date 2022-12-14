
export default class ObjectDescription {
    constructor(target, options) {
        this.html = ''
        this.info = null
        this.options = Object.assign({
            indent: 4, // 缩进
            quotes: `"`
        }, options)
        this.styleMapPath = {}
        this.nodeMapOptions = []

        if (typeof target === 'string') target = this.strToObj(target)
        const { INFO_TREE, INFO_MAP_PATH } = this.objToInfo(target)
        this.info = INFO_TREE
        this.infoMapPath = INFO_MAP_PATH

        const { formatter, style, styles, nodeMultiple, comment, declarator } = this.options
        if (formatter) {
            if (formatter.inline) formatter.inline.forEach(node => {
                INFO_MAP_PATH[node] && (INFO_MAP_PATH[node].isInline = true)
            })
        }
        if (styles) this.addStyle(styles)

        // 处理选项节点
        if (nodeMultiple) {
            const nodeMapOptions = {}
            for (let key in nodeMultiple) {
                const node = INFO_MAP_PATH[key]
                const [index, options, title = 'UNNAMED', names = []] = nodeMultiple[key]
                const arr = []
                const optionsInfo = []
                options.forEach((option, i) => {
                    const { INFO_TREE } = this.objToInfo(option, node, { isInline: true })
                    arr.push(INFO_TREE)
                    optionsInfo.push({ index: i, name: names[i] || i, node: key })
                })
                nodeMapOptions[key] = { title, options: optionsInfo }
                node.optionDefault = index
                node.options = arr
            }
            this.nodeMapOptions = nodeMapOptions
        }

        // 处理注释
        if (comment) {
            for (let key in comment) {
                INFO_MAP_PATH[key] && (INFO_MAP_PATH[key].comment = comment[key])
            }
        }

        // 说明
        if (declarator) {
            for (let key in declarator) {
                INFO_MAP_PATH[key] && (INFO_MAP_PATH[key].desc = declarator[key])
            }
        }
    }
    objToInfo(obj, parent, options) {
        const INFO_MAP_PATH = {}
        const INFO_TREE = { path: parent ? parent.path : '', order: 0, isOrderFirst: true, isOrderLast: true }
        options && Object.assign(INFO_TREE, options)
        function parseObj(obj, info, level) {
            info.children = []
            let i = 0, len = Object.keys(obj).length
            for (let key in obj) {
                const path = info.path + `.${key}`
                const childInfo = { key, path, order: i, structureType: 'VALUE' }
                if (i === 0) childInfo.isOrderFirst = true
                if (i >= len - 1) childInfo.isOrderLast = true
                INFO_MAP_PATH[path] = childInfo
                info.children.push(childInfo)
                parseTarget(obj[key], obj, childInfo, level + 1)
                i++
            }
        }
        function parseArr(arr, info, level) {
            info.children = []
            arr.forEach((e, i) => {
                const path = info.path + `[${i}]`
                const childInfo = { path, order: i, structureType: 'ITEM' }
                if (i === 0) childInfo.isOrderFirst = true
                if (i >= arr.length - 1) childInfo.isOrderLast = true
                INFO_MAP_PATH[path] = childInfo
                info.children.push(childInfo)
                parseTarget(e, arr, childInfo, level + 1)
            })
        }
        function parseTarget(target, parent, info, level) {
            info.level = level
            info.target = target
            info.targetParent = parent
            const dataType = Object.prototype.toString.call(target)
            info.dataType = dataType
            if (dataType === '[object Object]') parseObj(target, info, level)
            if (dataType === '[object Array]') parseArr(target, info, level)
        }
        const level = parent ? parent.level : 0
        parseTarget(obj, parent, INFO_TREE, level)
        return { INFO_TREE, INFO_MAP_PATH }
    }
    strToObj(str) {
        let exeStr = `(() => (${str}))()`
        return eval(exeStr)
    }
    addStyle(styles, clean) {
        if (!styles) return
        const styleMapPath = {}
        styles.forEach(([nodes, style]) => {
            nodes.forEach(path => { styleMapPath[path] = style })
        })
        clean ? this.styleMapPath = styleMapPath : Object.assign(this.styleMapPath, styleMapPath)
    }
    print({ styles, nodeSelector }, clean) {
        this.addStyle(styles, clean)
        if (nodeSelector) nodeSelector.forEach(([node, index]) => {
            this.infoMapPath[node].optionDefault = index
        })
        const { style } = this.options
        let html = ''
        if (style) html += `<span style="${style}">`
        html += this.printInfo(this.info, [])
        if (style) html += `</span>`
        return html
    }
    printInfo(info, inline) {
        const { quotes, indent } = this.options
        const { styleMapPath } = this
        const indentFn = (level, inline) => inline ? '' : new Array(level * indent + 1).join(' ')
        const dataTypeHandler = {
            '[object Object]': ({ level, children, isInline }) => {
                let html = '{' + (isInline ? '' : '\n')
                html += handleChildren(children, isInline)
                html += indentFn(level, isInline) + '}'
                return html
            },
            '[object Array]': ({ level, children, isInline }) => {
                let html = '[' + (isInline ? '' : '\n')
                html += handleChildren(children, isInline)
                html += indentFn(level, isInline) + ']'
                return html
            },
            '[object String]': ({ target }) => {
                if (target.match(/^[ABFNO]:/)) return target.replace(/^[ABFNO]:/, '')
                return quotes + target + quotes
            },
            '[object Number]': ({ target }) => target,
            '[object Boolean]': ({ target }) => target,
            '[object Function]': ({ target }) => target,
            '[object RegExp]': ({ target }) => target.toString()
        }
        const handleChildren = (children, inline) => {
            let html = ''
            if (!children) return html
            children.forEach(child => {
                html += handleTarget(child, inline)
            })
            return html
        }
        function handleTarget(info, inline) {
            let { dataType, structureType, key, isOrderLast, path, level, options, optionDefault, comment, desc } = info
            const style = styleMapPath[path]
            if (options) {
                info = options[optionDefault]
                dataType = info.dataType
            }
            let html = ''
            html += indentFn(level, inline)
            html += desc ? `<span class="object-description-desc" title="${desc}"></span>` : ''
            html += style ? `<span style="${style}">` : ''
            html += structureType === 'VALUE' ? key + ': ' : ''
            html += dataTypeHandler[dataType](info)
            html += style ? '</span>' : ''
            html += isOrderLast ? '' : ', '
            html += comment ? ' // ' + comment : ''
            html += (!comment && inline) ? '' : '\n'
            return html
        }
        return handleTarget(info, inline)
    }
}