import Step from "./Step";

export default class Dijkstra {
    nodes = [];
    path = new Map();
    flagedNodes = [];
    steps = new Map();
    from = null;
    to = null;
    flag = null;

    constructor(nodes, from, to) {
        this.nodes = nodes;
        this.from = nodes.find(element => element.node.id == from.id);
        this.to = nodes.find(element => element.node.id == to.id);
    }

    getMinStep() {
        var min = Number.MAX_VALUE;
        var keyA = null;
        for (const [key, value] of this.steps.entries()) {
            if (value.distance < min) {
                min = value.distance;
                keyA = key;
            }
        }
        return keyA;
    }

    clearDataConexions(map) {
        var aux=[]
        for (const [key, value] of map.entries()) {
           aux.push({from:key.node,to:value.node.node})
        }
        return aux;
    }

    clearPath(map){
        var aux=[]
        for (const [key, value] of map.entries()) {
            aux.push(value.node)
        }
        return aux
    }

    getNode(id) {
        return this.nodes.find(element => element.node.id == id);
    }

    eraseIterations(conexion) {
        this.path = new Map();
        var i = 0;
        return this.recursiveEraseIterations(conexion, this.to, i);
    }

    recursiveEraseIterations(conexion, currentNode, i) {
        this.path.set(i, currentNode);
        i++;
        if (currentNode == this.from) {
            return this.path;
        } else {
            return this.recursiveEraseIterations(conexion, conexion.get(currentNode).node, i);
        }
    }

    getMostShortPath() {
        this.flag = this.from;
        this.flagedNodes.push(this.flag);
        var conexion = new Map();
        var flagA = true;
        var distance = 0;
        var cont = 0;
        while (flagA) {
            var nodesAdy = this.flag.nodesConnected;
            for (var i = 0; i < nodesAdy.length; i++) {
                if (!this.flagedNodes.includes(nodesAdy[i].node)) {
                    if (this.steps.get(nodesAdy[i].node) == null || (distance + nodesAdy[i].value) < this.steps.get(nodesAdy[i].node).value) {
                        this.steps.set(this.getNode(nodesAdy[i].node.id), new Step(distance + nodesAdy[i].value, this.flag));
                    }
                }
            }
            this.flag = this.getMinStep();
            distance = this.steps.get(this.flag).distance;
            this.flagedNodes.push(this.flag.node);
            conexion.set(this.flag, this.steps.get(this.flag));
            this.steps.delete(this.flag);
            cont++;
            if (this.flag == this.to || cont == 100) {
                flagA = false;
            }
        }
        this.path = this.eraseIterations(conexion);
        return {
            pathComplete: this.clearDataConexions(conexion),
            pathShort: this.clearPath(this.path),
        };
    }
}

