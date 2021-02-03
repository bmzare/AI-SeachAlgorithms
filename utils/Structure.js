class View {
    constructor(parent = null, params = {}, navigator = null) {
        this.navigator = navigator;
        this.parent = parent;
        this.params = params;
        this.vision = document.createElement(this.getRootElement());
        this.buildVision(params)
    }

    getRootElement() {
        return "div";
    }

    buildVision(params) {

    }

    clear() {
        while (this.vision.firstChild) {
            this.vision.removeChild(this.vision.firstChild);
        }
    }

    animateIn(onAfter = null) {
        if (onAfter !== null) {
            if (this.getAnimateInDuration() !== 0) {
                setTimeout(onAfter, this.getAnimateInDuration());
            } else {
                onAfter();
            }
        }
    }

    animateOut(onAfter = null) {
        if (onAfter !== null) {
            if (this.getAnimateOutDuration() !== 0) {
                setTimeout(onAfter, this.getAnimateOutDuration());
            } else {
                onAfter();
            }
        }
    }

    moveIn(onAfter = null, parentNode = null, animate = false, position = -1, onInitial = null) {
        let targetNode = null;
        if (parentNode !== null) {
            targetNode = parentNode;
        } else if (this.parent !== null) {
            targetNode = this.parent.vision;
        }
        if (targetNode !== null) {
            if (position < 0) {
                position += targetNode.children.length + 1;
                if (position < 0) {
                    position = 0;
                }
            }
            targetNode.insertBefore(this.vision, targetNode.children[position]);
            if (onInitial !== null) {
                onInitial();
            }
            if (animate) {
                this.animateIn();
            }
            if (onAfter !== null) {
                if (this.getAnimateInDuration() !== 0) {
                    setTimeout(onAfter, this.getAnimateInDuration());
                } else {
                    onAfter();
                }
            }
        }
    }

    moveOut(onAfter = null, animate = false, onInitial = null) {
        if (onInitial !== null) {
            onInitial();
        }
        if (animate) {
            this.animateOut();
        }
        if (this.getAnimateOutDuration() !== 0) {
            setTimeout(() => {
                this.vision.remove();
                if (onAfter !== null) {
                    onAfter();
                }
            }, this.getAnimateOutDuration());
        } else {
            this.vision.remove();
            if (onAfter !== null) {
                onAfter();
            }
        }
    }

    getAnimateOutDuration() {
        return 0;
    }

    getAnimateInDuration() {
        return 0;
    }

    getNavigatorViewId() {
        return null;
    }
}