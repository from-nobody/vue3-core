import { effect } from "../reactivity"
import { EMPTY_OBJECT } from "../share"
import { ShapeFlags } from "../share/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { Fragment, Text } from "./vnode"


export function createRenderer (options) {

    const { createElement, patchProp: hostPatchProp, insert } = options


    function render (vnode, container) {
        patch(null, vnode, container, null)
    }

    function patch (vn1, vn2, container, parentComponent) {
        const { type, shapeFlags } = vn2

        switch (type) {
            case Fragment:                                  // avoid rendering wrapper div of slots children node 
                processFragment(vn1, vn2, container, parentComponent)
                break

            case Text: 
                processText(vn1, vn2, container)
                break

            default: 
                if (shapeFlags & ShapeFlags.ELEMENT) {        // vnode type is an element (string)
                    processElement(vn1, vn2, container, parentComponent)
                } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {        // vnode type is a component (object)
                    processComponent(vn1, vn2, container, parentComponent)
                }
                break
        }
    }

    function processFragment (vn1, vn2, container, parentComponent) {
        mountChildren(vn2.children, container, parentComponent)
    }

    function processText (vn1, vn2, container) {
        const { children } = vn2      // children must be a text node
        const text_node = (vn2.el = document.createTextNode(children))
        container.append(text_node)
    }

    function processElement (vn1, vn2, container, parentComponent) {
        if (!vn1) {
            mountElement(vn2, container, parentComponent)    // init element in the beginning
        } else {
            patchElement(vn1, vn2, container)                // update element afterwards
        }
    }
    function patchElement (vn1, vn2, container) {
        console.log('patch element')
        console.log('vn1: ', vn1)
        console.log('vn2: ', vn2)

        const oldProps = vn1.props || EMPTY_OBJECT
        const newProps = vn2.props || EMPTY_OBJECT

        const el = (vn2.el = vn1.el)

        patchProps(el, oldProps, newProps)
    }
    function patchProps(el, oldProps, newProps) {
        if (oldProps !== newProps) {
            for (const key in newProps) {
                const preProp = oldProps[key]
                const nextProp = newProps[key]
                if (preProp !== nextProp) {
                    hostPatchProp(el, key, preProp, nextProp)
                }
            }

            if (oldProps !== EMPTY_OBJECT) {
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        hostPatchProp(el, key, oldProps[key], null)
                    }
                }   
            } 
        }
    }

    function mountElement (vnode, container, parentComponent) { 
        const { type, props, children, shapeFlags } = vnode
        
        //  get element 
        const el = (vnode.el = createElement(type))

        // set props
        for (const key in props) {
            const val = props[key]
            hostPatchProp(el, key, null, val)
        }

        // handle children
        if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
            el.textContent = children
        } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el, parentComponent)
        }
        
        // append element
        insert(el, container)
    }

    function mountChildren (children, parent_container, parentComponent) {
        children.forEach(item => {
            patch(null, item, parent_container, parentComponent)
        })
    }

    function processComponent (vn1, vn2, container, parentComponent) {
        mountComponent(vn2, container, parentComponent)
    }

    function mountComponent (initialVNode, container, parentComponent) {
        const instance = createComponentInstance(initialVNode, parentComponent)
        setupComponent(instance)
        setupRenderEffect(instance, container, initialVNode)
    }

    function setupRenderEffect (instance, container, initialVNode) {
        effect(() => {
            if (!instance.isMounted) {
                // init 
                const subTree = (instance.subTree = instance.render.call(instance.proxy))
                patch(null, subTree, container, instance)
                initialVNode.el = subTree.el

                instance.isMounted = true
            } else {
                // update
                const preSubTree = instance.subTree
                const subTree = instance.render.call(instance.proxy)
                instance.subTree = subTree
                patch(preSubTree, subTree, container, instance)
            }
        })
    }


    return {
        createApp: createAppApi(render)
    }
}