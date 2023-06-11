import { ShapeFlags } from "../share/ShapeFlags"

export function initSlots (instance, children) {
    const { vnode } = instance

    if ( vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN ) {
        const slots = {}

        for (const slotName in children) {
            const slotNode = children[slotName]
            slots[slotName] = (props) => normalizeSlot(slotNode(props))
        }
        instance.slots = slots
    }
}


function normalizeSlot (slotNode) {
    return Array.isArray(slotNode) ? slotNode : [slotNode]
}